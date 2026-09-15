'use client';

import React, { useEffect, useState } from 'react';
import AdminLayout from '../AdminLayout';
import { createClient } from '@/lib/supabase/client';

interface FormResponse {
  id: string;
  name: string;
  email: string;
  phone: string;
  city: string;
  event_type: string;
  message: string;
  status: string;
  created_at: string;
}

const statusColors: Record<string, string> = {
  new: 'bg-blue-50 text-blue-700',
  contacted: 'bg-amber-50 text-amber-700',
  closed: 'bg-gray-100 text-gray-500',
};

export default function ResponsesPage() {
  const [responses, setResponses] = useState<FormResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<FormResponse | null>(null);
  const [filter, setFilter] = useState('all');
  const supabase = createClient();

  async function fetchResponses() {
    let query = supabase.from('form_responses').select('*').order('created_at', { ascending: false });
    if (filter !== 'all') query = query.eq('status', filter);
    const { data } = await query;
    setResponses(data || []);
    setLoading(false);
  }

  useEffect(() => { fetchResponses(); }, [filter]);

  async function updateStatus(id: string, status: string) {
    await supabase.from('form_responses').update({ status }).eq('id', id);
    await fetchResponses();
    if (selected?.id === id) setSelected((prev) => prev ? { ...prev, status } : null);
  }

  function exportCSV() {
    const headers = ['Name', 'Email', 'Phone', 'City', 'Event Type', 'Message', 'Status', 'Date'];
    const rows = responses.map((r) => [
      r.name, r.email, r.phone, r.city, r.event_type,
      `"${r.message?.replace(/"/g, '""')}"`,
      r.status,
      new Date(r.created_at).toLocaleDateString('en-IN'),
    ]);
    const csv = [headers, ...rows].map((r) => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `form-responses-${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`;
  };

  return (
    <AdminLayout>
      <div className="max-w-6xl mx-auto">
        <div className="mb-6 flex items-center justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-2xl font-800 text-gray-900">Form Responses</h1>
            <p className="text-gray-500 text-sm mt-1">View and manage contact form submissions.</p>
          </div>
          <button onClick={exportCSV} className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 text-white text-sm font-600 hover:bg-emerald-700 transition-colors">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" x2="12" y1="15" y2="3" /></svg>
            Export CSV
          </button>
        </div>

        {/* Filter tabs */}
        <div className="flex gap-2 mb-5">
          {['all', 'new', 'contacted', 'closed'].map((f) => (
            <button key={f} onClick={() => setFilter(f)} className={`px-4 py-2 rounded-xl text-sm font-600 transition-colors capitalize ${filter === f ? 'bg-violet-600 text-white' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'}`}>
              {f === 'all' ? 'All' : f}
            </button>
          ))}
        </div>

        <div className="flex gap-5">
          {/* List */}
          <div className="flex-1 bg-white border border-gray-100 rounded-2xl overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100">
              <p className="text-sm font-700 text-gray-900">{responses.length} response{responses.length !== 1 ? 's' : ''}</p>
            </div>
            {loading ? (
              <div className="p-8 text-center text-gray-400 text-sm">Loading...</div>
            ) : responses.length === 0 ? (
              <div className="p-8 text-center text-gray-400 text-sm">No responses yet.</div>
            ) : (
              <ul className="divide-y divide-gray-50">
                {responses.map((r) => (
                  <li
                    key={r.id}
                    onClick={() => setSelected(r)}
                    className={`px-6 py-4 cursor-pointer hover:bg-gray-50 transition-colors ${selected?.id === r.id ? 'bg-violet-50' : ''}`}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-600 text-gray-900 truncate">{r.name}</p>
                        <p className="text-xs text-gray-500 truncate">{r.email} · {r.city}</p>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-600 capitalize ${statusColors[r.status] || 'bg-gray-100 text-gray-500'}`}>{r.status}</span>
                        <span className="text-[10px] text-gray-400">{formatDate(r.created_at)}</span>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Detail panel */}
          {selected && (
            <div className="w-80 bg-white border border-gray-100 rounded-2xl p-6 flex-shrink-0 self-start sticky top-24">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-700 text-gray-900">Response Detail</h3>
                <button onClick={() => setSelected(null)} className="text-gray-400 hover:text-gray-600">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" x2="6" y1="6" y2="18" /><line x1="6" x2="18" y1="6" y2="18" /></svg>
                </button>
              </div>
              <div className="flex flex-col gap-3 text-sm">
                <div><p className="text-xs text-gray-400 font-600">Name</p><p className="text-gray-800 font-600">{selected.name}</p></div>
                <div><p className="text-xs text-gray-400 font-600">Email</p><a href={`mailto:${selected.email}`} className="text-violet-600 hover:underline">{selected.email}</a></div>
                <div><p className="text-xs text-gray-400 font-600">Phone</p><p className="text-gray-800">{selected.phone || '—'}</p></div>
                <div><p className="text-xs text-gray-400 font-600">City</p><p className="text-gray-800">{selected.city || '—'}</p></div>
                <div><p className="text-xs text-gray-400 font-600">Event Type</p><p className="text-gray-800">{selected.event_type || '—'}</p></div>
                <div><p className="text-xs text-gray-400 font-600">Message</p><p className="text-gray-700 leading-relaxed">{selected.message || '—'}</p></div>
                <div><p className="text-xs text-gray-400 font-600">Date</p><p className="text-gray-800">{formatDate(selected.created_at)}</p></div>
                <div>
                  <p className="text-xs text-gray-400 font-600 mb-1.5">Status</p>
                  <div className="flex gap-2">
                    {['new', 'contacted', 'closed'].map((s) => (
                      <button key={s} onClick={() => updateStatus(selected.id, s)} className={`px-3 py-1 rounded-full text-xs font-600 capitalize transition-colors ${selected.status === s ? 'bg-violet-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  return `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`;
}
