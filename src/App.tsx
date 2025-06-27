"use client";

import type React from "react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaPlus, FaReceipt } from "react-icons/fa";
import { BookingReceipt } from "./components/BookingReceipt/BookingReceipt";
import { DataForm } from "./components/DataForm/DataForm";
import { useBookingData } from "./hooks/useBookingData";
import styles from "./App.module.css";

const App: React.FC = () => {
  const { data, loading, error, setData } = useBookingData();
  const [showForm, setShowForm] = useState(!data); // Show form initially if no data
  const [hasData, setHasData] = useState(false);

  const handleShowCalendar = () => {
    console.log("Show calendar clicked");
    // Implement calendar modal or navigation
  };

  const handleShowBreakdown = () => {
    console.log("Show breakdown clicked");
    // Implement breakdown modal or detailed view
  };

  const handleDataSubmit = (newData: typeof data) => {
    setData(newData);
    setHasData(true);
    setShowForm(false);
  };

  const toggleForm = () => {
    setShowForm(!showForm);
  };

  if (loading) {
    return (
      <div className={styles.loading}>
        <motion.div
          className={styles.spinner}
          animate={{ rotate: 360 }}
          transition={{
            duration: 1,
            repeat: Number.POSITIVE_INFINITY,
            ease: "linear",
          }}
        />
        <p>Cargando datos de la reserva...</p>
      </div>
    );
  }

  if (error && !hasData) {
    return (
      <div className={styles.error}>
        <p>Error: {error}</p>
        <button
          className={styles.retryButton}
          onClick={() => setShowForm(true)}
        >
          Cargar Datos Manualmente
        </button>
      </div>
    );
  }

  return (
    <div className={styles.app}>
      <motion.header
        className={styles.header}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1>
          <FaReceipt className={styles.headerIcon} />
          Generador de Recibos de Reserva
        </h1>
        <p className={styles.subtitle}>
          Carga los datos y genera tu recibo en PDF
        </p>
      </motion.header>

      <main className={styles.main}>
        <div className={styles.controls}>
          <button
            className={`${styles.toggleButton} ${
              showForm ? styles.active : ""
            }`}
            onClick={toggleForm}
          >
            <FaPlus className={styles.buttonIcon} />
            {showForm ? "Ocultar Formulario" : "Cargar Datos"}
          </button>
        </div>

        <AnimatePresence mode="wait">
          {showForm && (
            <motion.div
              key="form"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className={styles.formContainer}
            >
              <DataForm
                initialData={data || undefined}
                onDataSubmit={handleDataSubmit}
                onToggleForm={toggleForm}
              />
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence mode="wait">
          {data && !showForm && (
            <motion.div
              key="receipt"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
            >
              <BookingReceipt
                data={data}
                onShowCalendar={handleShowCalendar}
                onShowBreakdown={handleShowBreakdown}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {!data && !showForm && (
          <motion.div
            className={styles.emptyState}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            <FaReceipt className={styles.emptyIcon} />
            <h3>No hay datos cargados</h3>
            <p>Haz clic en "Cargar Datos" para comenzar</p>
          </motion.div>
        )}
      </main>
    </div>
  );
};

export default App;
