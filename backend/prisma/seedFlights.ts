import { PrismaClient } from '../src/generated/prisma/index.js'

import moment from 'moment-timezone'

const prisma = new PrismaClient()

async function main() {
  // === 建立國家 ===
  const tw = await prisma.country.upsert({
    where: { countryCode: 'TW' },
    update: {},
    create: { countryCode: 'TW', countryName: 'Taiwan' },
  })
  const jp = await prisma.country.upsert({
    where: { countryCode: 'JP' },
    update: {},
    create: { countryCode: 'JP', countryName: 'Japan' },
  })

  // === 建立城市 ===
  const taipei =
  (await prisma.city.findFirst({
    where: { cityName: 'Taipei', countryId: tw.countryId },
  })) ??
  (await prisma.city.create({
    data: { cityName: 'Taipei', countryId: tw.countryId },
  }))

const tokyo =
  (await prisma.city.findFirst({
    where: { cityName: 'Tokyo', countryId: jp.countryId },
  })) ??
  (await prisma.city.create({
    data: { cityName: 'Tokyo', countryId: jp.countryId },
  }))


  // === 建立機場 ===
  await prisma.airport.upsert({
    where:  { airportCode: 'TPE' },                            
    update: {},
    create: { airportCode: 'TPE', airportName: 'Taoyuan International Airport', cityId: taipei.cityId },
  })
  await prisma.airport.upsert({
    where:  { airportCode: 'NRT' },
    update: {},
    create: { airportCode: 'NRT', airportName: 'Narita International Airport', cityId: tokyo.cityId },
  })

  // === 建立航班 ===
  const depUtc = moment.tz('2025-10-30 10:00', 'Asia/Taipei').utc().toDate()
  const arrUtc = moment.tz('2025-10-30 14:00', 'Asia/Tokyo').utc().toDate()

  await prisma.flight.create({
    data: {
      flightNumber: 'SW102',
      flightDate: new Date('2025-10-30'),
      originIata: 'TPE',
      destinationIata: 'NRT',
      depTimeUtc: depUtc,
      arrTimeUtc: arrUtc,
      status: 'SCHEDULED',
    },
  })

  console.log('假資料建立成功！')
}

main()
  .catch((err) => {
    console.error('Seed 發生錯誤：', err)
  })
  .finally(() => prisma.$disconnect())