import React, { useEffect, useMemo, useState } from 'react';
import QRCodeLib from 'qrcode';
import API from '../services/api'; 
import { TrainFront, MapPin, Ticket, QrCode, CalendarClock, User } from 'lucide-react';

// Static station data with distances (km) for fare calculation
const STATIONS = [
  { id: 'S01', name: 'Aluva', distance: 0 },
  { id: 'S02', name: 'Pulinchodu', distance: 1.8 },
  { id: 'S03', name: 'Companypady', distance: 2.8 },
  { id: 'S04', name: 'Ambattukavu', distance: 3.8 },
  { id: 'S05', name: 'Muttom', distance: 4.7 },
  { id: 'S06', name: 'Kalamassery', distance: 6.8 },
  { id: 'S07', name: 'Cochin Univ. (CUSAT)', distance: 8.1 },
  { id: 'S08', name: 'Pathadipalam', distance: 9.4 },
  { id: 'S09', name: 'Edapally', distance: 10.8 },
  { id: 'S10', name: 'Changampuzha Park', distance: 12.1 },
  { id: 'S11', name: 'Palarivattom', distance: 13.1 },
  { id: 'S12', name: 'JLN Stadium', distance: 14.2 },
  { id: 'S13', name: 'Kaloor', distance: 15.3 },
  { id: 'S14', name: 'Town Hall', distance: 15.7 },
  { id: 'S15', name: 'M.G Road', distance: 16.9 },
  { id: 'S16', name: 'Maharajas College', distance: 18.1 },
  { id: 'S17', name: 'Ernakulam South', distance: 19.0 },
  { id: 'S18', name: 'Kadavanthra', distance: 20.1 },
  { id: 'S19', name: 'Elamkulam', distance: 21.3 },
  { id: 'S20', name: 'Vyttila', distance: 22.7 },
  { id: 'S21', name: 'Thaikoodam', distance: 23.8 },
  { id: 'S22', name: 'Petta', distance: 24.9 },
  { id: 'S23', name: 'Vadakkekotta', distance: 25.5 },
  { id: 'S24', name: 'SN Junction', distance: 26.8 },
  { id: 'S25', name: 'Thrippunithura', distance: 27.9 }
];

const baseFare = 10; // minimum fare
const perKmFare = 2.5; // fare per km

const getFare = (fromId, toId) => {
  if (!fromId || !toId || fromId === toId) return 0;
  const from = STATIONS.find(s => s.id === fromId);
  const to = STATIONS.find(s => s.id === toId);
  if (!from || !to) return 0;
  const distance = Math.abs(to.distance - from.distance);
  return Math.max(baseFare, Math.round((baseFare + distance * perKmFare) * 10) / 10);
};

const defaultDate = new Date().toISOString().split('T')[0];

const BookTrain = () => {
  const [form, setForm] = useState({
    name: '',
    age: '',
    gender: 'Male',
    from: 'S01',
    to: 'S05',
    date: defaultDate,
  });
  const [ticket, setTicket] = useState(null);
  const [error, setError] = useState('');
  const [qrDataUrl, setQrDataUrl] = useState('');

  const fare = useMemo(() => getFare(form.from, form.to), [form.from, form.to]);

  const handleChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) {
      setError('Please enter passenger name.');
      return;
    }
    if (!form.age || Number(form.age) < 1) {
      setError('Please enter a valid age.');
      return;
    }
    if (form.from === form.to) {
      setError('Source and destination must be different.');
      return;
    }

    const ticketId = `KMRL-${Date.now().toString().slice(-6)}`;
    const payload = {
      ticketId,
      passenger: form.name.trim(),
      age: Number(form.age),
      gender: form.gender,
      from: form.from,
      to: form.to,
      date: form.date,
      fare,
    };

    const qrValue = JSON.stringify(payload);

    try {
      // Store ticket in backend
      const response = await API.post('/tickets', { ...payload, qrValue });
      setTicket({ ...response.data, qrValue });
    } catch (err) {
      console.error('Ticket save failed', err?.response?.data || err.message);
      setError(err?.response?.data?.message || 'Booking failed. Please try again.');
    }
  };

  // Generate QR code data URL whenever ticket changes
  useEffect(() => {
    const generateQr = async () => {
      if (!ticket?.qrValue) {
        setQrDataUrl('');
        return;
      }
      try {
        const url = await QRCodeLib.toDataURL(ticket.qrValue, { width: 200, margin: 2 });
        setQrDataUrl(url);
      } catch (err) {
        console.error('QR generation failed', err);
        setQrDataUrl('');
      }
    };
    generateQr();
  }, [ticket]);

  return (
    <div className="p-6 bg-slate-50 min-h-screen flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-full bg-teal-100 text-teal-700">
            <TrainFront size={26} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Book a Train</h1>
            <p className="text-sm text-slate-500">
              Reserve a seat, view fare instantly, and get a QR pass to board the metro.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
          <CalendarClock size={16} />
          <span>Same-day digital tickets • Instant QR</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Booking Form */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center gap-2 mb-4">
            <Ticket size={18} className="text-teal-600" />
            <h2 className="text-lg font-semibold text-slate-800">Passenger Details</h2>
          </div>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <label className="flex flex-col gap-2">
                <span className="text-sm font-semibold text-slate-700">Passenger Name</span>
                <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2">
                  <User size={16} className="text-slate-400" />
                  <input
                    type="text"
                    className="w-full bg-transparent outline-none text-sm text-slate-800"
                    placeholder="Enter full name"
                    value={form.name}
                    onChange={(e) => handleChange('name', e.target.value)}
                  />
                </div>
              </label>
              <div className="grid grid-cols-2 gap-3">
                <label className="flex flex-col gap-2">
                  <span className="text-sm font-semibold text-slate-700">Age</span>
                  <input
                    type="number"
                    min="1"
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-800 outline-none"
                    value={form.age}
                    onChange={(e) => handleChange('age', e.target.value)}
                  />
                </label>
                <label className="flex flex-col gap-2">
                  <span className="text-sm font-semibold text-slate-700">Gender</span>
                  <select
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-800 outline-none"
                    value={form.gender}
                    onChange={(e) => handleChange('gender', e.target.value)}
                  >
                    <option>Male</option>
                    <option>Female</option>
                    <option>Other</option>
                  </select>
                </label>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <label className="flex flex-col gap-2">
                <span className="text-sm font-semibold text-slate-700">From</span>
                <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2">
                  <MapPin size={16} className="text-slate-400" />
                  <select
                    className="w-full bg-transparent outline-none text-sm text-slate-800"
                    value={form.from}
                    onChange={(e) => handleChange('from', e.target.value)}
                  >
                    {STATIONS.map(station => (
                      <option key={station.id} value={station.id}>
                        {station.name}
                      </option>
                    ))}
                  </select>
                </div>
              </label>
              <label className="flex flex-col gap-2">
                <span className="text-sm font-semibold text-slate-700">To</span>
                <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2">
                  <MapPin size={16} className="text-slate-400" />
                  <select
                    className="w-full bg-transparent outline-none text-sm text-slate-800"
                    value={form.to}
                    onChange={(e) => handleChange('to', e.target.value)}
                  >
                    {STATIONS.map(station => (
                      <option key={station.id} value={station.id}>
                        {station.name}
                      </option>
                    ))}
                  </select>
                </div>
              </label>
              <label className="flex flex-col gap-2">
                <span className="text-sm font-semibold text-slate-700">Travel Date</span>
                <input
                  type="date"
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-800 outline-none"
                  value={form.date}
                  onChange={(e) => handleChange('date', e.target.value)}
                />
              </label>
            </div>

            {/* Fare summary */}
            <div className="bg-slate-900 text-white rounded-lg p-4 flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-wider text-slate-300 font-semibold">Estimated Fare</p>
                <div className="text-2xl font-bold">₹ {fare.toFixed(1)}</div>
                <p className="text-[11px] text-slate-300 mt-1">
                  Fare = ₹{baseFare} base + ₹{perKmFare}/km • Distance auto-calculated
                </p>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <QrCode size={18} className="text-emerald-300" />
                <span>QR issued after booking</span>
              </div>
            </div>

            {error && (
              <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                {error}
              </div>
            )}

            <div className="flex justify-end">
              <button
                type="submit"
                className="bg-teal-600 hover:bg-teal-700 text-white font-semibold px-5 py-2 rounded-lg shadow-sm transition-colors"
              >
                Book Ticket
              </button>
            </div>
          </form>
        </div>

        {/* Ticket + QR */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <QrCode size={18} className="text-teal-600" />
            <h3 className="text-lg font-semibold text-slate-800">Boarding Pass (QR)</h3>
          </div>
          {!ticket ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center text-slate-500 border border-dashed border-slate-200 rounded-lg p-6">
              <div className="p-3 rounded-full bg-slate-100 text-slate-400 mb-3">
                <Ticket size={24} />
              </div>
              <p className="font-semibold text-slate-600">No ticket yet</p>
              <p className="text-xs text-slate-500">Fill the form and tap “Book Ticket” to generate a QR pass.</p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="rounded-lg border border-slate-200 p-4 bg-slate-50">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-slate-500 uppercase">Ticket ID</span>
                  <span className="text-sm font-bold text-slate-800">{ticket.ticketId}</span>
                </div>
                <div className="grid grid-cols-2 gap-3 text-sm text-slate-700">
                  <div>
                    <p className="text-xs text-slate-500">Passenger</p>
                    <p className="font-semibold">{ticket.passenger}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">Age / Gender</p>
                    <p className="font-semibold">{ticket.age} / {ticket.gender}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">From</p>
                    <p className="font-semibold">{STATIONS.find(s => s.id === ticket.from)?.name}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">To</p>
                    <p className="font-semibold">{STATIONS.find(s => s.id === ticket.to)?.name}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">Travel Date</p>
                    <p className="font-semibold">{ticket.date}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">Fare</p>
                    <p className="font-semibold text-teal-700">₹ {ticket.fare}</p>
                  </div>
                </div>
              </div>
              <div className="flex flex-col items-center gap-2 border border-slate-200 rounded-lg p-4">
                {qrDataUrl ? (
                  <img src={qrDataUrl} alt="Boarding QR" className="w-42 h-42" />
                ) : (
                  <div className="w-[168px] h-[168px] bg-slate-100 rounded-lg flex items-center justify-center text-xs text-slate-400">
                    Generating QR...
                  </div>
                )}
                <p className="text-xs text-slate-500 text-center">
                  Show this QR at the gate to climb the metro. Valid for the selected date only and expires after 1 hour.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookTrain;

