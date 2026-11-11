import type { Metadata } from 'next';
import './globals.css';
export const metadata: Metadata = {
 title:'BEYOND — Un cuaderno de Japón',
 description:'Del 24 de abril al 15 de mayo de 2027. Un viaje de Tokio al norte de Japón, contado en siete capítulos.',
 icons:{icon:'/favicon.svg'},
};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="es"><body>{children}</body></html>}
