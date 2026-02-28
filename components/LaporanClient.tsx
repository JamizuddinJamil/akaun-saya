'use client'

import React from 'react'
import Link from 'next/link'

// Definisi interface untuk data kategori
interface CategoryData {
  name: string
  icon: string
  type: string
  total: number
  count: number
}

interface LaporanClientProps {
  monthLabel: string
  transactionsCount: number
  prevMonth: string
  nextMonth: string
  isCurrentMonth: boolean
  totalIncome: number
  totalExpense: number
  categories: CategoryData[]
}

export default function LaporanClient({
  monthLabel,
  transactionsCount,
  prevMonth,
  nextMonth,
  isCurrentMonth,
  totalIncome,
  totalExpense,
  categories
}: LaporanClientProps) {
  
  const netProfit = totalIncome - totalExpense;

  return (
    <div style={{
      maxWidth: '430px', margin: '0 auto',
      padding: '0 16px 100px', fontFamily: 'sans-serif'
    }}>

      {/* Header */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: '12px',
        padding: '20px 0 16px'
      }}>
        <Link href="/dashboard" style={{
          width: '36px', height: '36px', background: 'white',
          border: '2px solid #e8eeec', borderRadius: '10px',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '16px', textDecoration: 'none', flexShrink: 0
        }}>
          ←
        </Link>
        <h1 style={{ fontSize: '18px', fontWeight: 800, color: '#0f1f1a' }}>
          Laporan Kewangan
        </h1>
      </div>

      {/* Month selector */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        background: 'white', borderRadius: '16px', padding: '12px 16px',
        marginBottom: '16px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
      }}>
        <Link href={`/laporan?month=${prevMonth}`} style={{
          width: '36px', height: '36px', display: 'flex',
          alignItems: 'center', justifyContent: 'center',
          fontSize: '18px', textDecoration: 'none', color: '#0d7a5f',
          fontWeight: 800
        }}>
          ‹
        </Link>
        <div style={{ textAlign: 'center' }}>
          <p style={{ fontSize: '15px', fontWeight: 800, color: '#0f1f1a' }}>
            {monthLabel}
          </p>
          <p style={{ fontSize: '10px', color: '#888', marginTop: '2px' }}>
            {transactionsCount} transaksi
          </p>
        </div>
        <Link href={`/laporan?month=${nextMonth}`} style={{
          width: '36px', height: '36px', display: 'flex',
          alignItems: 'center', justifyContent: 'center',
          fontSize: '18px', textDecoration: 'none',
          color: isCurrentMonth ? '#ccc' : '#0d7a5f',
          fontWeight: 800,
          pointerEvents: isCurrentMonth ? 'none' : 'auto'
        }}>
          ›
        </Link>
      </div>

      {/* Summary card */}
      <div style={{
        background: netProfit >= 0 ? '#0d7a5f' : '#d94f3d',
        borderRadius: '20px', padding: '20px',
        color: 'white', marginBottom: '16px'
      }}>
        <p style={{ fontSize: '11px', opacity: 0.7, letterSpacing: '1px', marginBottom: '4px' }}>
          UNTUNG BERSIH
        </p>
        <h2 style={{ fontSize: '28px', fontWeight: 800, marginBottom: '16px' }}>
          RM {((Math.abs(netProfit)) / 100).toFixed(2)}
          {netProfit < 0 &&
            <span style={{ fontSize: '13px', marginLeft: '6px' }}>(rugi)</span>
          }
        </h2>
        <div style={{ display: 'flex', gap: '10px' }}>
          <div style={{
            flex: 1, background: 'rgba(255,255,255,0.15)',
            borderRadius: '12px', padding: '10px'
          }}>
            <p style={{ fontSize: '10px', opacity: 0.7, marginBottom: '3px' }}>💰 PENDAPATAN</p>
            <p style={{ fontWeight: 800, fontSize: '15px' }}>
              RM {(totalIncome / 100).toFixed(2)}
            </p>
          </div>
          <div style={{
            flex: 1, background: 'rgba(255,255,255,0.15)',
            borderRadius: '12px', padding: '10px'
          }}>
            <p style={{ fontSize: '10px', opacity: 0.7, marginBottom: '3px' }}>💸 PERBELANJAAN</p>
            <p style={{ fontWeight: 800, fontSize: '15px' }}>
              RM {(totalExpense / 100).toFixed(2)}
            </p>
          </div>
        </div>
      </div>

      {/* Category breakdown */}
      {categories.length > 0 && (
        <div style={{ marginBottom: '16px' }}>
          <h3 style={{
            fontSize: '12px', fontWeight: 700, color: '#888',
            letterSpacing: '1px', textTransform: 'uppercase',
            marginBottom: '10px'
          }}>
            MENGIKUT KATEGORI
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {categories.map((cat, i) => {
              const baseTotal = cat.type === 'EXPENSE' ? totalExpense : totalIncome
              const pct = baseTotal > 0 ? Math.round((cat.total / baseTotal) * 100) : 0
              const isExpense = cat.type === 'EXPENSE'
              return (
                <div key={i} style={{
                  background: 'white', borderRadius: '14px',
                  padding: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
                }}>
                  <div style={{
                    display: 'flex', alignItems: 'center',
                    gap: '10px', marginBottom: '8px'
                  }}>
                    <div style={{
                      width: '36px', height: '36px', borderRadius: '10px',
                      background: isExpense ? '#fdf0ee' : '#e6f5f1',
                      display: 'flex', alignItems: 'center',
                      justifyContent: 'center', fontSize: '18px', flexShrink: 0
                    }}>
                      {cat.icon}
                    </div>
                    <div style={{ flex: 1 }}>
                      <p style={{ fontSize: '12px', fontWeight: 700, color: '#0f1f1a' }}>
                        {cat.name}
                      </p>
                      <p style={{ fontSize: '10px', color: '#888', marginTop: '1px' }}>
                        {cat.count} transaksi
                      </p>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <p style={{
                        fontSize: '13px', fontWeight: 800,
                        color: isExpense ? '#d94f3d' : '#0d7a5f'
                      }}>
                        RM {(cat.total / 100).toFixed(2)}
                      </p>
                      <p style={{ fontSize: '10px', color: '#888', marginTop: '1px' }}>
                        {pct}%
                      </p>
                    </div>
                  </div>
                  <div style={{
                    height: '4px', background: '#f0f0f0',
                    borderRadius: '2px', overflow: 'hidden'
                  }}>
                    <div style={{
                      height: '100%', borderRadius: '2px',
                      width: `${pct}%`,
                      background: isExpense ? '#d94f3d' : '#0d7a5f',
                      transition: 'width 0.3s ease'
                    }} />
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Empty state */}
      {transactionsCount === 0 && (
        <div style={{
          background: 'white', borderRadius: '16px', padding: '40px',
          textAlign: 'center', color: '#666'
        }}>
          <p style={{ fontSize: '36px', marginBottom: '8px' }}>📭</p>
          <p style={{ fontSize: '14px', fontWeight: 600 }}>Tiada rekod untuk bulan ini</p>
          <p style={{ fontSize: '12px', marginTop: '4px' }}>
            Cuba pilih bulan lain atau tambah rekod baru
          </p>
        </div>
      )}

      {/* Bottom nav */}
      <div style={{
        position: 'fixed', bottom: 0, left: 0, right: 0,
        background: 'white', borderTop: '1px solid #e8eeec',
        display: 'flex', padding: '10px 0 20px', zIndex: 10
      }}>
        {[
          { href: '/dashboard', icon: '🏠', label: 'Utama' },
          { href: '/tambah',    icon: '➕', label: 'Tambah' },
          { href: '/laporan',   icon: '📊', label: 'Laporan', active: true },
        ].map(item => (
          <Link key={item.href} href={item.href} style={{
            flex: 1, display: 'flex', flexDirection: 'column',
            alignItems: 'center', gap: '3px', textDecoration: 'none',
            color: item.active ? '#0d7a5f' : '#888'
          }}>
            <span style={{ fontSize: '20px' }}>{item.icon}</span>
            <span style={{ fontSize: '10px', fontWeight: 700 }}>{item.label}</span>
          </Link>
        ))}
      </div>

    </div>
  )
}