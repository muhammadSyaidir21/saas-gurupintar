import { faker } from "@faker-js/faker"

export interface OperatorPackage {
  id: string
  tier: "dasar" | "standar" | "premium" | "perusahaan"
  name: string
  price: number
  features: string[]
  purchaseDate: string
  expiryDate: string
}

export interface Operator {
  id: string
  name: string
  email: string
  phone: string
  role: string
  status: "aktif" | "menunggu" | "ditangguhkan" | "tidak aktif"
  region: string
  schools: number
  packages: OperatorPackage[]
  lastActive: string
  createdAt: string
  company?: {
    name: string
    position: string
    department: string
  }
  address?: {
    street: string
    city: string
    state: string
    zipCode: string
    country: string
  }
  settings?: {
    twoFactorEnabled: boolean
    notificationsEnabled: boolean
    language: string
    timezone: string
  }
  quotaUsage?: {
    total: number
    used: number
    remaining: number
    lastUpdated: string
  }
  customPermissions?: string[]
}

export interface Role {
  id: string
  name: string
  description: string
  permissions: string[]
}

export interface Permission {
  id: string
  name: string
  description: string
  module: string
}

export const mockRoles: Role[] = [
  {
    id: "role-001",
    name: "Administrator",
    description: "Akses penuh ke semua fitur",
    permissions: ["lihat_laporan", "kelola_pengguna", "kelola_pengaturan"],
  },
  {
    id: "role-002",
    name: "Manajer",
    description: "Kelola pengguna dan lihat laporan",
    permissions: ["lihat_laporan", "kelola_pengguna"],
  },
  {
    id: "role-003",
    name: "Dukungan",
    description: "Lihat laporan dan kelola pengguna",
    permissions: ["lihat_laporan", "kelola_pengguna"],
  },
  {
    id: "role-004",
    name: "Pengamat",
    description: "Hanya dapat melihat laporan",
    permissions: ["lihat_laporan"],
  },
]

export const mockPermissions: Permission[] = [
  {
    id: "lihat_laporan",
    name: "Lihat Laporan",
    description: "Memungkinkan pengguna untuk melihat laporan",
    module: "Laporan",
  },
  {
    id: "kelola_pengguna",
    name: "Kelola Pengguna",
    description: "Memungkinkan pengguna untuk mengelola akun pengguna",
    module: "Pengguna",
  },
  {
    id: "kelola_pengaturan",
    name: "Kelola Pengaturan",
    description: "Memungkinkan pengguna untuk mengelola pengaturan sistem",
    module: "Pengaturan",
  },
]

export function generateMockOperators(count: number): Operator[] {
  const operators: Operator[] = []
  const regions = ["Utara", "Selatan", "Timur", "Barat", "Tengah"]
  const statuses: ("aktif" | "menunggu" | "ditangguhkan" | "tidak aktif")[] = ["aktif", "menunggu", "ditangguhkan", "tidak aktif"]
  const accountTypes = ["Individu", "Organisasi"]

  for (let i = 0; i < count; i++) {
    const firstName = faker.person.firstName()
    const lastName = faker.person.lastName()
    const name = `${firstName} ${lastName}`
    const email = faker.internet.email({ firstName: firstName, lastName: lastName }).toLowerCase()

    const operator: Operator = {
      id: `op-${(i + 1).toString().padStart(3, "0")}`,
      name,
      email,
      phone: faker.phone.number(),
      role: faker.helpers.arrayElement(["Manajer Regional", "Koordinator Distrik", "Administrator Sekolah"]),
      status: faker.helpers.arrayElement(statuses),
      region: faker.helpers.arrayElement(regions),
      schools: faker.number.int({ min: 1, max: 20 }),
      packages: [
        {
          id: faker.string.uuid(),
          tier: faker.helpers.arrayElement(["dasar", "standar", "premium", "perusahaan"]),
          name: faker.commerce.productName(),
          price: faker.number.float({ min: 100, max: 1000, precision: 0.01 }),
          features: faker.helpers.arrayElements(
            mockPermissions.map((p) => p.name),
            3,
          ),
          purchaseDate: faker.date.past().toISOString(),
          expiryDate: faker.date.future().toISOString(),
        },
      ],
      lastActive: faker.date.recent().toISOString(),
      createdAt: faker.date.past({ years: 1 }).toISOString(),
      company: {
        name: faker.company.name(),
        position: faker.person.jobTitle(),
        department: faker.commerce.department(),
      },
      address: {
        street: faker.location.streetAddress(),
        city: faker.location.city(),
        state: faker.location.state(),
        zipCode: faker.location.zipCode(),
        country: faker.location.country(),
      },
      settings: {
        twoFactorEnabled: faker.datatype.boolean(),
        notificationsEnabled: faker.datatype.boolean(),
        language: faker.helpers.arrayElement(["Indonesia", "Inggris", "Jawa"]),
        timezone: faker.helpers.arrayElement(["WIB", "WITA", "WIT"]),
      },
      quotaUsage: {
        total: faker.number.int({ min: 500, max: 2000 }),
        used: faker.number.int({ min: 100, max: 500 }),
        remaining: faker.number.int({ min: 0, max: 1000 }),
        lastUpdated: faker.date.recent().toISOString(),
      },
      customPermissions: faker.helpers.arrayElements(
        mockPermissions.map((p) => p.id),
        faker.number.int({ min: 0, max: 5 }),
      ),
      accountType: faker.helpers.arrayElement(accountTypes),
    }

    operators.push(operator)
  }

  return operators
}

