"use client"

import { useEffect, useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

const AUTH_URL = process.env.NEXT_PUBLIC_AUTH_URL || 'https://autoclipp-auth.akuntiktok76y.workers.dev'
function getAdminToken(){ if(typeof window==='undefined') return null; return localStorage.getItem('admin_token') }
function authHeaders(){ const t=getAdminToken(); const h:any={}; if(t) h['Authorization']=`Bearer ${t}`; return h }

export default function AdminUsersPage() {
  const [users, setUsers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`${AUTH_URL}/admin/users`, { credentials: 'include', headers: authHeaders() })
      .then(r => r.json())
      .then(data => {
        if (data.users) setUsers(data.users)
        else if (data.error?.includes('Unauthorized')) window.location.href='/admin/login'
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  return (
    <div className="min-h-screen bg-[#FCFCF9]">
      <div className="sticky top-0 z-40 border-b border-[#E8E8E3] bg-[#0A0A0A] text-white">
        <div className="mx-auto max-w-[1280px] px-6 h-[56px] flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/admin/dashboard" className="flex items-center gap-2">
              <div className="h-7 w-7 rounded-[8px] bg-white text-black flex items-center justify-center font-[800] text-[12px]">A</div>
              <span className="text-[13px] font-[700]">autoclipp admin</span>
            </Link>
            <div className="hidden md:flex items-center gap-1">
              <Link href="/admin/dashboard" className="px-3 py-1 rounded-full text-[12px] text-white/60">Dashboard</Link>
              <Link href="/admin/payments" className="px-3 py-1 rounded-full text-[12px] text-white/60">Payments</Link>
              <span className="px-3 py-1 rounded-full bg-white text-black text-[12px] font-[600]">Users</span>
            </div>
          </div>
          <Link href="/admin/dashboard"><Button size="sm" variant="outline" className="h-8 bg-white/10 border-white/20 text-white">Dashboard</Button></Link>
        </div>
      </div>

      <div className="mx-auto max-w-[1280px] px-6 py-8">
        <h1 className="text-[22px] font-[700] tracking-[-0.02em]">Users — Real Data</h1>
        <p className="text-[12px] text-[#6B6B6B] mt-1">All registered users • Verified • Real • {users.length} total</p>

        <Card className="mt-6 overflow-hidden p-0">
          <div className="overflow-auto">
            <table className="w-full text-[12px]">
              <thead className="bg-[#F5F5F0] border-b border-[#E8E8E3] text-[11px] font-[600] tracking-[0.04em] uppercase text-[#6B6B6B]">
                <tr>
                  <th className="text-left p-3">User</th>
                  <th className="text-left p-3">Email Verified</th>
                  <th className="text-left p-3">Provider</th>
                  <th className="text-left p-3">Plan</th>
                  <th className="text-left p-3">Created</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={5} className="p-8 text-center text-[#6B6B6B]">Loading...</td></tr>
                ) : users.length === 0 ? (
                  <tr><td colSpan={5} className="p-12 text-center"><div className="text-[13px] font-[600]">No users yet</div><div className="text-[11px] text-[#6B6B6B] mt-1">Users will appear after Google OAuth or email verification</div></td></tr>
                ) : (
                  users.map(u => (
                    <tr key={u.id} className="border-b border-[#E8E8E3]/60 hover:bg-[#F5F5F0]/50">
                      <td className="p-3">
                        <div className="flex items-center gap-2.5">
                          <div className="h-7 w-7 rounded-full bg-[#0A0A0A] text-white flex items-center justify-center text-[11px] font-[700]">{u.name?.[0] || u.email[0]}</div>
                          <div>
                            <div className="font-[600] text-[12px]">{u.name || '-'}</div>
                            <div className="text-[11px] text-[#6B6B6B]">{u.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="p-3"><span className={`text-[10px] px-2 py-0.5 rounded-full font-[600] ${u.email_verified ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-amber-50 text-amber-700 border border-amber-200'}`}>{u.email_verified ? 'Verified' : 'Pending'}</span></td>
                      <td className="p-3"><span className="text-[10px] px-2 py-0.5 rounded-full bg-[#F5F5F0] border border-[#E8E8E3] font-[600]">{u.provider}</span></td>
                      <td className="p-3"><span className="text-[10px] px-2 py-0.5 rounded-full bg-[#0A0A0A] text-white font-[600]">{u.current_plan || 'free'}</span></td>
                      <td className="p-3 text-[11px] text-[#6B6B6B]">{new Date(u.created_at).toLocaleDateString('id-ID')}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  )
}
