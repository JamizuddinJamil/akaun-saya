import { PrismaClient, TransactionType } from '@prisma/client'

const prisma = new PrismaClient()

// Category presets by business type - matching onboarding flow
export const CATEGORY_PRESETS: Record<string, Array<{
  name: string; icon: string; type: TransactionType; sortOrder: number
}>> = {
  
  // 🍽️ Kedai Makan
  kedai_makan: [
    // Expenses
    { name: 'Bahan Masakan',   icon: '🥩', type: 'EXPENSE', sortOrder: 1 },
    { name: 'Gas',             icon: '🔥', type: 'EXPENSE', sortOrder: 2 },
    { name: 'Upah Pekerja',    icon: '👩‍🍳', type: 'EXPENSE', sortOrder: 3 },
    { name: 'Sewa Kedai',      icon: '🏪', type: 'EXPENSE', sortOrder: 4 },
    { name: 'Utiliti',         icon: '💡', type: 'EXPENSE', sortOrder: 5 },
    // Income
    { name: 'Jualan Harian',   icon: '💰', type: 'INCOME', sortOrder: 1 },
    { name: 'Delivery',        icon: '🛵', type: 'INCOME', sortOrder: 2 },
    { name: 'Catering',        icon: '🍱', type: 'INCOME', sortOrder: 3 },
  ],

  // 🏪 Kedai Runcit
  kedai_runcit: [
    // Expenses
    { name: 'Stok Barang',     icon: '📦', type: 'EXPENSE', sortOrder: 1 },
    { name: 'Sewa',            icon: '🏪', type: 'EXPENSE', sortOrder: 2 },
    { name: 'Utiliti',         icon: '💡', type: 'EXPENSE', sortOrder: 3 },
    { name: 'Gaji',            icon: '👤', type: 'EXPENSE', sortOrder: 4 },
    { name: 'Promosi',         icon: '📱', type: 'EXPENSE', sortOrder: 5 },
    // Income
    { name: 'Jualan Tunai',    icon: '💰', type: 'INCOME', sortOrder: 1 },
    { name: 'Jualan Kredit',   icon: '💳', type: 'INCOME', sortOrder: 2 },
  ],

  // 🔨 Kontraktor
  contractor: [
    // Expenses
    { name: 'Bahan Binaan',    icon: '🧱', type: 'EXPENSE', sortOrder: 1 },
    { name: 'Upah Pekerja',    icon: '👷', type: 'EXPENSE', sortOrder: 2 },
    { name: 'Transport',       icon: '🚚', type: 'EXPENSE', sortOrder: 3 },
    { name: 'Peralatan',       icon: '🔨', type: 'EXPENSE', sortOrder: 4 },
    { name: 'Permit',          icon: '📋', type: 'EXPENSE', sortOrder: 5 },
    // Income
    { name: 'Projek',          icon: '💰', type: 'INCOME', sortOrder: 1 },
    { name: 'Kerja Tambahan',  icon: '🛠️', type: 'INCOME', sortOrder: 2 },
    { name: 'Konsultasi',      icon: '📊', type: 'INCOME', sortOrder: 3 },
  ],

  // 💼 Freelancer
  freelancer: [
    // Expenses
    { name: 'Software',        icon: '💻', type: 'EXPENSE', sortOrder: 1 },
    { name: 'Internet',        icon: '📡', type: 'EXPENSE', sortOrder: 2 },
    { name: 'Marketing',       icon: '📱', type: 'EXPENSE', sortOrder: 3 },
    { name: 'Training',        icon: '📚', type: 'EXPENSE', sortOrder: 4 },
    // Income
    { name: 'Projek',          icon: '💰', type: 'INCOME', sortOrder: 1 },
    { name: 'Retainer',        icon: '📅', type: 'INCOME', sortOrder: 2 },
    { name: 'Komisen',         icon: '💵', type: 'INCOME', sortOrder: 3 },
  ],

  // 📦 Penjual Online
  online_seller: [
    // Expenses
    { name: 'Stok',            icon: '📦', type: 'EXPENSE', sortOrder: 1 },
    { name: 'Postage',         icon: '📮', type: 'EXPENSE', sortOrder: 2 },
    { name: 'Packaging',       icon: '📦', type: 'EXPENSE', sortOrder: 3 },
    { name: 'Marketing',       icon: '📱', type: 'EXPENSE', sortOrder: 4 },
    { name: 'Platform Fee',    icon: '💳', type: 'EXPENSE', sortOrder: 5 },
    // Income
    { name: 'Shopee',          icon: '🛒', type: 'INCOME', sortOrder: 1 },
    { name: 'Lazada',          icon: '🛍️', type: 'INCOME', sortOrder: 2 },
    { name: 'Facebook',        icon: '📘', type: 'INCOME', sortOrder: 3 },
    { name: 'Instagram',       icon: '📸', type: 'INCOME', sortOrder: 4 },
  ],

  // 🚗 Sewa Kereta
  car_rental: [
    // Expenses
    { name: 'Fuel',            icon: '⛽', type: 'EXPENSE', sortOrder: 1 },
    { name: 'Servis',          icon: '🔧', type: 'EXPENSE', sortOrder: 2 },
    { name: 'Insurans',        icon: '📋', type: 'EXPENSE', sortOrder: 3 },
    { name: 'Cuci Kereta',     icon: '🧹', type: 'EXPENSE', sortOrder: 4 },
    { name: 'Repair',          icon: '🛠️', type: 'EXPENSE', sortOrder: 5 },
    // Income
    { name: 'Sewa Harian',     icon: '💰', type: 'INCOME', sortOrder: 1 },
    { name: 'Sewa Mingguan',   icon: '📅', type: 'INCOME', sortOrder: 2 },
    { name: 'Deposit',         icon: '💵', type: 'INCOME', sortOrder: 3 },
  ],

  // 🎨 Sewa Dekorasi
  decoration_rental: [
    // Expenses
    { name: 'Inventory',       icon: '🎨', type: 'EXPENSE', sortOrder: 1 },
    { name: 'Transport',       icon: '🚚', type: 'EXPENSE', sortOrder: 2 },
    { name: 'Storage',         icon: '🏪', type: 'EXPENSE', sortOrder: 3 },
    { name: 'Repair',          icon: '🔨', type: 'EXPENSE', sortOrder: 4 },
    { name: 'Pembungkusan',    icon: '📦', type: 'EXPENSE', sortOrder: 5 },
    // Income
    { name: 'Sewa Dekorasi',   icon: '💰', type: 'INCOME', sortOrder: 1 },
    { name: 'Setup Service',   icon: '🛠️', type: 'INCOME', sortOrder: 2 },
    { name: 'Deposit',         icon: '💵', type: 'INCOME', sortOrder: 3 },
  ],

  // 🍱 Katering
  catering: [
    // Expenses
    { name: 'Bahan Masakan',   icon: '🥩', type: 'EXPENSE', sortOrder: 1 },
    { name: 'Packaging',       icon: '📦', type: 'EXPENSE', sortOrder: 2 },
    { name: 'Transport',       icon: '🚗', type: 'EXPENSE', sortOrder: 3 },
    { name: 'Upah',            icon: '👩‍🍳', type: 'EXPENSE', sortOrder: 4 },
    { name: 'Gas',             icon: '🔥', type: 'EXPENSE', sortOrder: 5 },
    // Income
    { name: 'Majlis',          icon: '🎉', type: 'INCOME', sortOrder: 1 },
    { name: 'Delivery',        icon: '🛵', type: 'INCOME', sortOrder: 2 },
    { name: 'Catering Bulanan', icon: '📅', type: 'INCOME', sortOrder: 3 },
  ],

  // 👤 Personal
  personal: [
    // Expenses
    { name: 'Makanan',         icon: '🍽️', type: 'EXPENSE', sortOrder: 1 },
    { name: 'Transport',       icon: '🚗', type: 'EXPENSE', sortOrder: 2 },
    { name: 'Bills',           icon: '💡', type: 'EXPENSE', sortOrder: 3 },
    { name: 'Shopping',        icon: '🛍️', type: 'EXPENSE', sortOrder: 4 },
    { name: 'Lain-lain',       icon: '📌', type: 'EXPENSE', sortOrder: 5 },
    // Income
    { name: 'Gaji',            icon: '💰', type: 'INCOME', sortOrder: 1 },
    { name: 'Bonus',           icon: '💵', type: 'INCOME', sortOrder: 2 },
    { name: 'Side Income',     icon: '💸', type: 'INCOME', sortOrder: 3 },
  ],
}

export async function seedDefaultCategories(userId: string, businessType: string = 'personal') {
  const preset = CATEGORY_PRESETS[businessType] || CATEGORY_PRESETS.personal

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