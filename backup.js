class SupabaseBackupManager {
  constructor(supabaseClient, bucketName, onProgress = null) {
    if (!supabaseClient) throw new Error('Supabase client is required for backup.');
    this.supabase = supabaseClient;
    this.bucket = bucketName;
    this.onProgress = onProgress || ((msg) => console.log(msg));
  }

  async runBackup() {
    try {
      this.onProgress('Collecting all files...', 'info');
      const allFiles = await this._listAllFilesRecursive('');

      if (allFiles.length === 0) {
        this.onProgress('Bucket is empty – nothing to backup', 'warning');
        return { success: false, error: 'Bucket is empty' };
      }

      this.onProgress(`Found ${allFiles.length} file(s). Downloading fresh copies...`, 'info');

      const zip = new JSZip();
      const hashParts = [];
      let processed = 0;

      for (const filePath of allFiles) {
        try {
          const { data: signed, error: signErr } = await this.supabase
            .storage
            .from(this.bucket)
            .createSignedUrl(filePath, 60);

          if (signErr) throw signErr;

          const res = await fetch(signed.signedUrl, { cache: 'no-store' });
          if (!res.ok) throw new Error(`HTTP ${res.status}`);

          const arrayBuffer = await res.arrayBuffer();
          zip.file(filePath, arrayBuffer);

          hashParts.push({ path: filePath, buffer: arrayBuffer });
        } catch (err) {
          console.warn(`Failed to download ${filePath}:`, err);
          this.onProgress(`Skipped ${filePath}`, 'warning');
        }

        processed++;
        if (processed % 5 === 0 || processed === allFiles.length) {
          this.onProgress(`Downloaded ${processed} / ${allFiles.length}`, 'info');
        }
      }

      this.onProgress('Calculating archive hash...', 'info');
      const shortHash = await this._computeHash(hashParts);

      const today = new Date().toISOString().slice(0, 10);
      const zipName = `${this.bucket}_${today}_${shortHash}.zip`;

      this.onProgress('Compressing into ZIP archive...', 'info');
      const blob = await zip.generateAsync({
        type: 'blob',
        compression: 'DEFLATE',
        compressionOptions: { level: 6 }
      });

      this._triggerDownload(blob, zipName);

      this.onProgress(`Backup ready: ${zipName}`, 'success');
      return { success: true, filename: zipName };
    } catch (err) {
      console.error('Backup failed:', err);
      this.onProgress(err.message || 'Backup failed', 'error');
      return { success: false, error: err.message };
    }
  }

  async _listAllFilesRecursive(prefix = '') {
    const results = [];
    const { data, error } = await this.supabase
      .storage
      .from(this.bucket)
      .list(prefix, { limit: 1000, offset: 0 });

    if (error) throw error;

    for (const item of (data || [])) {
      if (item.name === '.emptyFolderPlaceholder') continue;
      const fullPath = prefix ? `${prefix}/${item.name}` : item.name;

      if (!item.id) {
        const subFiles = await this._listAllFilesRecursive(fullPath);
        results.push(...subFiles);
      } else {
        results.push(fullPath);
      }
    }
    return results;
  }

  async _computeHash(hashParts) {
    hashParts.sort((a, b) => a.path.localeCompare(b.path));

    const encoder = new TextEncoder();
    const chunks = [];
    let totalLength = 0;

    for (const part of hashParts) {
      const pathBytes = encoder.encode(part.path);
      const contentBytes = new Uint8Array(part.buffer);

      chunks.push(pathBytes);
      chunks.push(new Uint8Array([0]));
      chunks.push(contentBytes);

      totalLength += pathBytes.length + 1 + contentBytes.length;
    }

    const combined = new Uint8Array(totalLength);
    let offset = 0;
    for (const chunk of chunks) {
      combined.set(chunk, offset);
      offset += chunk.length;
    }

    const hashBuffer = await crypto.subtle.digest('SHA-256', combined);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('').slice(0, 16);
  }

  _triggerDownload(blob, filename) {
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = filename;
    a.click();
    URL.revokeObjectURL(a.href);
  }
}
