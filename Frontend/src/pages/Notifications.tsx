
import React from 'react';
import TopAppBar from '../components/TopAppBar';

const Notifications: React.FC = () => {
  const notifications = [
    { id: 1, title: '¡Baja de precio!', message: 'La casa en Juana Koslay ahora está USD 140.000', type: 'price', time: 'Hace 2 horas', isRead: false },
    { id: 2, title: 'Nueva propiedad para ti', message: 'Se ha publicado un departamento que coincide con tu búsqueda.', type: 'new', time: 'Hace 5 horas', isRead: false },
    { id: 3, title: 'Visita confirmada', message: 'Tu cita para ver el Departamento Céntrico es mañana a las 10:00.', type: 'visit', time: 'Ayer', isRead: true },
    { id: 4, title: 'Bienvenido a Oriente', message: 'Gracias por registrarte. Comienza a explorar las mejores propiedades.', type: 'system', time: 'Hace 2 días', isRead: true },
  ];

  const getIcon = (type: string) => {
    switch (type) {
      case 'price': return 'trending_down';
      case 'new': return 'add_home';
      case 'visit': return 'event_available';
      default: return 'notifications';
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-background-light dark:bg-background-dark">
      <TopAppBar title="Notificaciones" showBack />
      
      <div className="p-4 flex-1">
        <div className="flex justify-between items-center mb-6 px-2">
            <h2 className="text-xl font-black dark:text-white">Bandeja de entrada</h2>
            <button className="text-primary text-xs font-black uppercase">Marcar todas</button>
        </div>

        <div className="space-y-3">
          {notifications.map((notif) => (
            <div 
              key={notif.id} 
              className={`p-5 rounded-[2rem] border transition-all flex gap-4 ${notif.isRead ? 'bg-white/50 dark:bg-navy/50 border-gray-100 dark:border-gray-800' : 'bg-white dark:bg-navy border-primary/20 shadow-sm'}`}
            >
              <div className={`size-12 rounded-2xl flex items-center justify-center shrink-0 ${notif.isRead ? 'bg-gray-100 dark:bg-gray-800 text-gray-400' : 'bg-primary/10 text-primary'}`}>
                <span className="material-symbols-outlined">{getIcon(notif.type)}</span>
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start mb-1">
                  <h4 className={`text-sm font-black ${notif.isRead ? 'text-gray-500' : 'text-navy dark:text-white'}`}>{notif.title}</h4>
                  <span className="text-[10px] font-bold text-gray-400 uppercase">{notif.time}</span>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">{notif.message}</p>
              </div>
            </div>
          ))}
        </div>

        {notifications.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 opacity-30">
            <span className="material-symbols-outlined text-8xl mb-4">notifications_off</span>
            <p className="font-bold">No tienes notificaciones aún</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Notifications;
