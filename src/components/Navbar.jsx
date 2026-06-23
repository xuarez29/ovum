import { CalendarDays, Download, LayoutDashboard, Plus, Trash2, Upload, Users } from 'lucide-react';

export default function Navbar({ activeView, onViewChange, onAddUser, onExport, onImportClick, onClearAll }) {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'users', label: 'Usuarias', icon: Users },
    { id: 'calendar', label: 'Calendario', icon: CalendarDays }
  ];

  return (
    <header className="sticky top-0 z-20 border-b border-arcillaLine bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-3 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-3">
          <span className="h-4 w-4 rounded-full bg-[radial-gradient(circle_at_35%_30%,#e0a23a,#ce6b54)] shadow-[0_0_0_5px_#fff,0_0_0_6px_#ece1d6]" />
          <div>
            <h1 className="font-serif text-2xl font-medium text-ink">Ovum</h1>
            <p className="text-sm text-arcillaMuted">Monitoreo menstrual privado y multiusuaria.</p>
          </div>
        </div>
        <nav className="flex flex-wrap items-center gap-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onViewChange(item.id)}
                className={`focus-ring inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition ${
                  isActive ? 'bg-ink text-white' : 'bg-[#fcf8f3] text-arcillaSub hover:bg-[#f4eadf]'
                }`}
              >
                <Icon size={16} />
                {item.label}
              </button>
            );
          })}
          <button onClick={onAddUser} className="focus-ring inline-flex items-center gap-2 rounded-full bg-ink px-3 py-2 text-sm font-bold text-white hover:bg-[#463b34]">
            <Plus size={16} />
            Agregar
          </button>
          <button onClick={onExport} className="focus-ring rounded-md bg-[#fcf8f3] p-2 text-arcillaSub hover:bg-[#f4eadf]" title="Exportar JSON" aria-label="Exportar JSON">
            <Download size={18} />
          </button>
          <button onClick={onImportClick} className="focus-ring rounded-md bg-[#fcf8f3] p-2 text-arcillaSub hover:bg-[#f4eadf]" title="Importar JSON" aria-label="Importar JSON">
            <Upload size={18} />
          </button>
          <button onClick={onClearAll} className="focus-ring rounded-md bg-coralSoft p-2 text-period hover:bg-[#f3d8ce]" title="Borrar todos los datos" aria-label="Borrar todos los datos">
            <Trash2 size={18} />
          </button>
        </nav>
      </div>
    </header>
  );
}
