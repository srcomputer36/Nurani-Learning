/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export const GoogleDriveService = {
  /**
   * Generates a direct view URL for a Google Drive PDF
   */
  getViewUrl: (fileId: string): string => {
    return `https://drive.google.com/file/d/${fileId}/view`;
  },

  /**
   * Generates a direct download/export URL for the PDF
   */
  getDownloadUrl: (fileId: string): string => {
    return `https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`;
  },

  /**
   * Generates a thumbnail URL for the PDF
   */
  getThumbnailUrl: (fileId: string): string => {
    // Drive API v3 provides a thumbnailLink in the metadata
    // For a generic way to construct it if we only have the ID:
    return `https://lh3.googleusercontent.com/d/${fileId}=s200`;
  },
  
  /**
   * Gets the metadata of a file including the thumbnailLink
   */
  getFileMetadataUrl: (fileId: string): string => {
    return `https://www.googleapis.com/drive/v3/files/${fileId}?fields=id,name,mimeType,thumbnailLink,size`;
  }
};
