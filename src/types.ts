export interface Item {
  id: string;
  outfit_id: string;
  tên_sp: string;
  danh_mục: string;
  ảnh_sp: string;
  link_mua: string;
}

export interface Outfit {
  id: string;
  tên_outfit: string;
  giá: string | number;
  ảnh: string;
  mô_tả?: string;
  gallery?: string;
}

export interface CartItem {
  outfitId: string;
  itemId?: string;
  quantity: number;
}
