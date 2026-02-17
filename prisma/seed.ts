import { PrismaClient, TransactionType } from '@prisma/client'

const prisma = new PrismaClient()

// Category presets by business type
export const CATEGORY_PRESETS: Record<string, Array<{
  name: string; icon: string; type: TransactionType; sortOrder: number
}>> = {
  
  // 🍽️ Katering & Makanan
  catering: [
    // Expenses
    { name: 'Bahan Masakan',   icon: '🥩', type: 'EXPENSE', sortOrder: 1 },
    { name: 'Pengangkutan',    icon: '🚗', type: 'EXPENSE', sortOrder: 2 },
    { name: 'Pembungkusan',    icon: '📦', type: 'EXPENSE', sortOrder: 3 },
    { name: 'Upah Pekerja',    icon: '👩‍🍳', type: 'EXPENSE', sortOrder: 4 },
    { name: 'Peralatan Dapur', icon: '🛒', type: 'EXPENSE', sortOrder: 5 },
    { name: 'Utiliti',         icon: '💡', type: 'EXPENSE', sortOrder: 6 },
    { name: 'Sewaan Premis',   icon: '🏪', type: 'EXPENSE', sortOrder: 7 },
    { name: 'Lain-lain',       icon: '📌', type: 'EXPENSE', sortOrder: 8 },
    // Income
    { name: 'Majlis / Event',      icon: '🎉', type: 'INCOME', sortOrder: 1 },
    { name: 'Tempahan Katering',   icon: '🍱', type: 'INCOME', sortOrder: 2 },
    { name: 'Jualan Terus',        icon: '💰', type: 'INCOME', sortOrder: 3 },
  ],

  // 🚗 Sewa Kereta
  car_rental: [
    // Expenses
    { name: 'Fuel & Minyak',         icon: '⛽', type: 'EXPENSE', sortOrder: 1 },
    { name: 'Servis & Maintenance',  icon: '🔧', type: 'EXPENSE', sortOrder: 2 },
    { name: 'Insurans & Roadtax',    icon: '📋', type: 'EXPENSE', sortOrder: 3 },
    { name: 'Cuci Kereta',           icon: '🧹', type: 'EXPENSE', sortOrder: 4 },
    { name: 'Repair & Spare Parts',  icon: '🛠️', type: 'EXPENSE', sortOrder: 5 },
    { name: 'Marketing',             icon: '📱', type: 'EXPENSE', sortOrder: 6 },
    { name: 'Admin & Lesen',         icon: '📄', type: 'EXPENSE', sortOrder: 7 },
    { name: 'Lain-lain',             icon: '📌', type: 'EXPENSE', sortOrder: 8 },
    // Income
    { name: 'Sewa Harian',      icon: '💰', type: 'INCOME', sortOrder: 1 },
    { name: 'Sewa Mingguan',    icon: '📅', type: 'INCOME', sortOrder: 2 },
    { name: 'Deposit Returns',  icon: '💵', type: 'INCOME', sortOrder: 3 },
  ],

  // 🎨 Sewa Dekorasi
  decoration_rental: [
    // Expenses
    { name: 'Pembelian Inventory',  icon: '🎨', type: 'EXPENSE', sortOrder: 1 },
    { name: 'Transport & Delivery', icon: '🚚', type: 'EXPENSE', sortOrder: 2 },
    { name: 'Sewaan Stor',          icon: '🏪', type: 'EXPENSE', sortOrder: 3 },
    { name: 'Repair & Maintenance', icon: '🔨', type: 'EXPENSE', sortOrder: 4 },
    { name: 'Pembungkusan',         icon: '📦', type: 'EXPENSE', sortOrder: 5 },
    { name: 'Marketing',            icon: '📱', type: 'EXPENSE', sortOrder: 6 },
    { name: 'Lain-lain',            icon: '📌', type: 'EXPENSE', sortOrder: 7 },
    // Income
    { name: 'Sewa Dekorasi',    icon: '💰', type: 'INCOME', sortOrder: 1 },
    { name: 'Setup Service',    icon: '🛠️', type: 'INCOME', sortOrder: 2 },
    { name: 'Deposit Returns',  icon: '💵', type: 'INCOME', sortOrder: 3 },
  ],

  // 🏪 Kedai Runcit
  retail: [
    // Expenses
    { name: 'Pembelian Stok',   icon: '📦', type: 'EXPENSE', sortOrder: 1 },
    { name: 'Sewa Kedai',       icon: '🏪', type: 'EXPENSE', sortOrder: 2 },
    { name: 'Utiliti',          icon: '💡', type: 'EXPENSE', sortOrder: 3 },
    { name: 'Gaji Pekerja',     icon: '👤', type: 'EXPENSE', sortOrder: 4 },
    { name: 'Transport',        icon: '🚗', type: 'EXPENSE', sortOrder: 5 },
    { name: 'Marketing',        icon: '📱', type: 'EXPENSE', sortOrder: 6 },
    { name: 'Lain-lain',        icon: '📌', type: 'EXPENSE', sortOrder: 7 },
    // Income
    { name: 'Jualan Harian',  icon: '💰', type: 'INCOME', sortOrder: 1 },
    { name: 'Jualan Online',  icon: '📱', type: 'INCOME', sortOrder: 2 },
  ],

  // ➕ Generic (fallback)
  generic: [
    // Expenses
    { name: 'Operasi',      icon: '🏢', type: 'EXPENSE', sortOrder: 1 },
    { name: 'Gaji',         icon: '👤', type: 'EXPENSE', sortOrder: 2 },
    { name: 'Sewa',         icon: '🏪', type: 'EXPENSE', sortOrder: 3 },
    { name: 'Utiliti',      icon: '💡', type: 'EXPENSE', sortOrder: 4 },
    { name: 'Marketing',    icon: '📱', type: 'EXPENSE', sortOrder: 5 },
    { name: 'Transport',    icon: '🚗', type: 'EXPENSE', sortOrder: 6 },
    { name: 'Lain-lain',    icon: '📌', type: 'EXPENSE', sortOrder: 7 },
    // Income
    { name: 'Jualan',       icon: '💰', type: 'INCOME', sortOrder: 1 },
    { name: 'Servis',       icon: '🛠️', type: 'INCOME', sortOrder: 2 },
  ],
}

export async function seedDefaultCategories(userId: string, businessType: string = 'generic') {
  const preset = CATEGORY_PRESETS[businessType] || CATEGORY_PRESETS.generic

  await prisma.category.createMany({
    data: preset.map(cat => ({
      ...cat,
      userId,
      isDefault: true,
    })),
    skipDuplicates: true,
  })
}

async function main() {
  console.log('Seed complete — category presets ready.')
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())