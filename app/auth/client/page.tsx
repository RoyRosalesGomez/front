'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  ShoppingCart, 
  ArrowLeft, 
  ArrowRight,
  Leaf
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

export default function ClientWelcome() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-blue-100">
      {/* Header */}
      <header className="bg-white/95 backdrop-blur-sm shadow-lg sticky top-0 z-40">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <motion.div 
              className="flex items-center space-x-3"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="bg-gradient-to-r from-green-500 to-blue-500 p-2 rounded-xl">
                <Leaf className="h-8 w-8 text-white" />
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                AgroGlobal
              </h1>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Button 
                variant="outline"
                className="border-blue-200 hover:bg-blue-50 text-blue-700"
                onClick={() => window.location.href = '/dashboard-select'}
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Atrás
              </Button>
            </motion.div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-20">
        <div className="max-w-2xl mx-auto text-center">
          {/* Welcome Section */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-2xl">
              <CardContent className="p-12">
                <motion.div 
                  className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 text-white mb-8"
                  whileHover={{ scale: 1.1, rotate: 360 }}
                  transition={{ duration: 0.6 }}
                >
                  <ShoppingCart className="h-12 w-12" />
                </motion.div>
                
                <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                  Bienvenido al Sector Cliente
                </h2>
                
                <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                  Accede a nuestro marketplace exclusivo para descubrir productos agrícolas 
                  frescos y de la más alta calidad directamente de los productores.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button 
                    variant="outline"
                    size="lg"
                    className="px-8 py-3 text-lg border-gray-300 hover:bg-gray-50"
                    onClick={() => window.location.href = '/dashboard-select'}
                  >
                    <ArrowLeft className="mr-2 h-5 w-5" />
                    Atrás
                  </Button>
                  
                  <Button 
                    size="lg"
                    className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white px-8 py-3 text-lg rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                    onClick={() => window.location.href = '/auth/client/login'}
                  >
                    Ir
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}