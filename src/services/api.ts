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
    console.log(`Fetching: ${url}`);
    const res = await fetch(url);
    if (!res.ok) return null;
    return await res.text();
  };

  try {
    // Try fetching by GID first as it is more reliable than sheet name
    let csvData = await tryFetch(sheetId, true);
    
    // If GID fetch doesn't yield expected columns for items, try common sheet names
    if (sheetId === SHEETS.ITEMS && (!csvData || !csvData.includes('link_mua'))) {
      const names = ['Trang tính 2', 'Trang_tính_2', 'Sheet2', 'Items'];
      for (const name of names) {
        const data = await tryFetch(name, false);
        if (data && data.includes('link_mua')) {
          csvData = data;
          break;
        }
      }
    }
    
    // If still no data, try GID 0 as last resort for outfits
    if (!csvData && sheetId === SHEETS.OUTFITS) {
      csvData = await tryFetch('0', true);
    }

    if (!csvData) throw new Error('Could not fetch data');
    
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

            // ID Mapping
            const idValue = normalizedRow.id || normalizedRow.ID || normalizedRow['mã'] || 
                            normalizedRow['stt'] || normalizedRow.no || 
                            normalizedRow.id_item || normalizedRow.outfit_id;
            if (idValue) normalizedRow.id = idValue.replace('#', '').trim();
            
            // Foreign Key Mapping
            const outfitIdValue = normalizedRow.outfit_id || normalizedRow.OUTFIT_ID || 
                                  normalizedRow['mã outfit'] || normalizedRow['outfit id'] ||
                                  normalizedRow['mã set'] || normalizedRow['set id'];
            if (outfitIdValue) normalizedRow.outfit_id = outfitIdValue.replace('#', '').trim();

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
