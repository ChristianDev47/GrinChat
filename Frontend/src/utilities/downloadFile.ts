export const downloadFile = (fileUrl: string, fileName: string) => {
  fetch(fileUrl, {
    method: 'GET',
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error('Error al descargar el archivo.');
      }
      return response.blob();
    })
    .then((blob) => {
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', fileName || 'archivo-descargado');
      document.body.appendChild(link);
      link.click();

      link.parentNode?.removeChild(link);
      window.URL.revokeObjectURL(url);
    })
    .catch((error) => {
      console.error('Error al descargar el archivo:', error);
    });
};
