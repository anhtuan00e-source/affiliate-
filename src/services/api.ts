import Papa from 'papaparse';

const BASE_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRdfSqqlSqB-s8W5mXy1I1MqPzNmMUTaFhD_urSS157-PURxt1RhVVsRKytXfaeBVu4aG6FhL1lMQAM/pub?output=csv';

export const SHEETS = {
  OUTFITS: '0', // Default GID for first sheet
  ITEMS: '1172173498' // Correct GID provided by the user
};

export async function fetchData(sheetId: string): Promise<any[]> {
  const tryFetch = async (id: string, isGid: boolean) => {
    const param = isGid ? `gid=${id}` : `sheet=${encodeURIComponent(id)}`;
    const url = `${BASE_URL}&${param}&t=${Date.now()}`;
    try {
      const res = await fetch(url);
      if (!res.ok) return null;
      const text = await res.text();
      // If Google returns an HTML page instead of CSV, it's an error
      if (text.includes('<!DOCTYPE html>') || text.includes('<html')) return null;
      return text;
    } catch (e) {
      return null;
    }
  };

  try {
    // 1. Try fetching by GID first
    let csvData = await tryFetch(sheetId, true);
    
    // 2. If GID fails or returns invalid data, try common sheet names
    if (!csvData || csvData.trim().split('\n').length <= 1) {
      const names = sheetId === SHEETS.OUTFITS 
        ? ['Trang tính 1', 'Trang_tính_1', 'Sheet1', 'Outfits']
        : ['Trang tính 2', 'Trang_tính_2', 'Sheet2', 'Items'];
        
      for (const name of names) {
        const data = await tryFetch(name, false);
        if (data && data.trim().split('\n').length > 1) {
          csvData = data;
          break;
        }
      }
    }
    
    // 3. Last resort fallback for Outfits
    if (!csvData && sheetId === SHEETS.OUTFITS) {
      csvData = await tryFetch('0', true);
    }

    if (!csvData) {
      console.error(`Failed to fetch data for sheetId: ${sheetId}`);
      throw new Error('Could not fetch data from Google Sheets');
    }
    
    return new Promise<any[]>((resolve, reject) => {
      Papa.parse(csvData!, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          const cleanedData = results.data.map((row: any) => {
            const normalizedRow: any = {};
            Object.keys(row).forEach(key => {
              const val = row[key]?.toString().trim();
              if (val !== undefined && val !== null) {
                normalizedRow[key.toLowerCase().trim()] = val;
              }
            });

            // ID Mapping - Be very aggressive in finding an ID
            const idValue = normalizedRow.id || 
                            normalizedRow.id_item || 
                            normalizedRow.outfit_id || 
                            normalizedRow['mã'] || 
                            normalizedRow['stt'] || 
                            normalizedRow.no ||
                            normalizedRow.ID ||
                            Object.values(normalizedRow)[0]; // Fallback to first column
            
            if (idValue) {
              normalizedRow.id = idValue.toString().replace('#', '').trim();
            }
            
            // Foreign Key Mapping for Items
            const outfitIdValue = normalizedRow.outfit_id || 
                                  normalizedRow['mã outfit'] || 
                                  normalizedRow['outfit id'] ||
                                  normalizedRow['mã set'] || 
                                  normalizedRow['set id'] ||
                                  normalizedRow.id?.split('-')[0]; // Try to derive from id_item (e.g. 1-1 -> 1)
            
            if (outfitIdValue) {
              normalizedRow.outfit_id = outfitIdValue.toString().replace('#', '').trim();
            }

            // Outfit Mapping (Sheet 1)
            if (!normalizedRow.ảnh && normalizedRow.image) normalizedRow.ảnh = normalizedRow.image;
            if (!normalizedRow.ảnh && normalizedRow['hình ảnh']) normalizedRow.ảnh = normalizedRow['hình ảnh'];
            
            if (!normalizedRow.tên_outfit && (normalizedRow.outfit_name || normalizedRow.name || normalizedRow['tên set'] || normalizedRow['tên outfit'])) {
              normalizedRow.tên_outfit = normalizedRow.outfit_name || normalizedRow.name || normalizedRow['tên set'] || normalizedRow['tên outfit'];
            }

            if (!normalizedRow.giá && (normalizedRow.price || normalizedRow['giá bán'] || normalizedRow['chi phí'])) {
              normalizedRow.giá = normalizedRow.price || normalizedRow['giá bán'] || normalizedRow['chi phí'];
            }

            if (!normalizedRow.mô_tả && (normalizedRow.description || normalizedRow['nội dung'] || normalizedRow['chi tiết'])) {
              normalizedRow.mô_tả = normalizedRow.description || normalizedRow['nội dung'] || normalizedRow['chi tiết'];
            }

            // Item Mapping (Sheet 2)
            if (!normalizedRow.ảnh_sp && (normalizedRow.ảnh || normalizedRow.product_image || normalizedRow.image || normalizedRow['hình ảnh'] || normalizedRow['ảnh sản phẩm'] || normalizedRow['ảnh sản phẩm '])) {
              normalizedRow.ảnh_sp = normalizedRow.ảnh || normalizedRow.product_image || normalizedRow.image || normalizedRow['hình ảnh'] || normalizedRow['ảnh sản phẩm'] || normalizedRow['ảnh sản phẩm '];
            }
            
            if (!normalizedRow.tên_sp && (normalizedRow.product_name || normalizedRow.name || normalizedRow['tên sản phẩm'] || normalizedRow['tên'] || normalizedRow['sản phẩm'] || normalizedRow['tên sp'] || normalizedRow['product'] || normalizedRow['item name'] || normalizedRow['danh mục'])) {
              normalizedRow.tên_sp = normalizedRow.product_name || normalizedRow.name || normalizedRow['tên sản phẩm'] || normalizedRow['tên'] || normalizedRow['sản phẩm'] || normalizedRow['tên sp'] || normalizedRow['product'] || normalizedRow['item name'] || normalizedRow['danh mục'];
            }

            if (!normalizedRow.danh_mục && (normalizedRow.category || normalizedRow['loại'] || normalizedRow['phân loại'] || normalizedRow['danh mục'] || normalizedRow['type'])) {
              normalizedRow.danh_mục = normalizedRow.category || normalizedRow['loại'] || normalizedRow['phân loại'] || normalizedRow['danh mục'] || normalizedRow['type'];
            }

            if (!normalizedRow.link_mua && (normalizedRow.link || normalizedRow.url || normalizedRow['link shopee'] || normalizedRow['mua tại'] || normalizedRow['đường dẫn'] || normalizedRow['link mua'] || normalizedRow['shopee'] || normalizedRow['buy link'])) {
              normalizedRow.link_mua = normalizedRow.link || normalizedRow.url || normalizedRow['link shopee'] || normalizedRow['mua tại'] || normalizedRow['đường dẫn'] || normalizedRow['link mua'] || normalizedRow['shopee'] || normalizedRow['buy link'];
            }

            return normalizedRow;
          });
          
          const filteredData = cleanedData.filter((row: any) => row.id && row.id !== '');
          console.log(`Fetched ${sheetId}:`, filteredData);
          resolve(filteredData);
        },
        error: (error: any) => reject(error)
      });
    });
  } catch (error) {
    console.error(`Error fetching ${sheetId}:`, error);
    return [];
  }
}
