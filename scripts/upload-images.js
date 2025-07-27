import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

const SUPABASE_URL = "https://bvbsjfhuclqjzconvqml.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ2YnNqZmh1Y2xxanpjb252cW1sIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMyNTgzMjEsImV4cCI6MjA2ODgzNDMyMX0.vueiTNstvaYe68WQdnjDEgxl8aIZU3N1sub2T3kHeKU";

const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);

async function uploadImages() {
  try {
    const imagesDir = path.join(process.cwd(), 'src', 'assets', 'Urun1');
    const files = fs.readdirSync(imagesDir);
    
    console.log('Görseller yükleniyor...');
    
    for (const file of files) {
      if (file.match(/\.(jpg|jpeg|png|gif)$/i)) {
        const filePath = path.join(imagesDir, file);
        const fileBuffer = fs.readFileSync(filePath);
        
        const fileName = `urun1-${file}`;
        
        const { data, error } = await supabase.storage
          .from('product-images')
          .upload(fileName, fileBuffer, {
            cacheControl: '3600',
            upsert: true,
          });
        
        if (error) {
          console.error(`Hata: ${file} yüklenemedi:`, error);
        } else {
          const { data: publicUrlData } = supabase.storage
            .from('product-images')
            .getPublicUrl(fileName);
          
          console.log(`✅ ${file} yüklendi:`, publicUrlData.publicUrl);
        }
      }
    }
    
    console.log('Tüm görseller yüklendi!');
  } catch (error) {
    console.error('Hata:', error);
  }
}

uploadImages(); 