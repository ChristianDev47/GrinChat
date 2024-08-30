import type { Metadata } from 'next';
import { Poppins } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '../context/auth';
import { ChatProvider } from '../context/chats';
import { ConversationProvider } from '../context/conversation';
import { FiltersProvider } from '../context/chatFilters';
import { Toaster } from 'react-hot-toast';
import { ModalProvider } from '../context/modal';

const poppins = Poppins({
  weight: ['300'],
  subsets: ['latin'],
  preload: true,
});

export const metadata: Metadata = {
  title: 'GrinChat',
  description: 'Chat_online',
  icons: '/icon.svg',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={poppins.className}>
        <AuthProvider>
          <ChatProvider>
            <ConversationProvider>
                <ModalProvider>
                  <FiltersProvider>
                    {children}
                    <Toaster position="bottom-right" />
                  </FiltersProvider>
                </ModalProvider>
            </ConversationProvider>
          </ChatProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
