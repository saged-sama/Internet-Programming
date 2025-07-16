import * as XLSX from 'xlsx';

export const dataFileReader = {
    dataFileToJson: async (binaryFile: File): Promise<any[]> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const bin = e.target?.result;
                    if (!bin) {
                        resolve([]);
                        return;
                    }
                    const workbook = XLSX.read(bin, { type: 'array' });
                    const sheetName = workbook.SheetNames[0];
                    const worksheet = workbook.Sheets[sheetName];
                    const jsonData = XLSX.utils.sheet_to_json(worksheet);
                    
                    resolve(jsonData);
                } catch (error) {
                    reject(error);
                }
            };
            reader.onerror = () => reject(new Error('Failed to read file'));
            reader.readAsArrayBuffer(binaryFile);
        });
    }
}