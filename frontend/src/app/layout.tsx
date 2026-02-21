'use client';

import React from 'react';
import { ApolloProvider } from '@apollo/client';
import client from '@/lib/apollo-client';
import Navbar from '@/components/ui/Navbar';
import './globals.css';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <title>School Management System</title>
        <meta name="description" content="Modern school management system with stunning UI" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
      </head>
      <body className="antialiased">
        <ApolloProvider client={client}>
          <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-primary-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
            <Navbar />
            <main className="min-h-[calc(100vh-4rem)]">
              {children}
            </main>
          </div>
        </ApolloProvider>
      </body>
    </html>
  );
}
