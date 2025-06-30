"use client";

import type React from "react";
import { useRef } from "react";
import { motion } from "framer-motion";
import { FaCalendarAlt, FaDownload, FaEye } from "react-icons/fa";
import type { BookingData } from "../../types/booking";
import { generatePDF } from "../../utils/pdfGenerator";
import styles from "./BookingReceipt.module.css";

// Agregar la prop showForm al interface BookingReceiptProps
interface BookingReceiptProps {
  data: BookingData;
  onShowCalendar?: () => void;
  onShowBreakdown?: () => void;
  showForm?: boolean;
  onDataChange?: (data: BookingData) => void;
}

// Actualizar el componente para incluir la prop showForm
export const BookingReceipt: React.FC<BookingReceiptProps> = ({
  data,
  onShowCalendar,
  onShowBreakdown,
  // showForm = false,
  // onDataChange,
}) => {
  const receiptRef = useRef<HTMLDivElement>(null);

  const handleGeneratePDF = async () => {
    if (receiptRef.current) {
      await generatePDF(receiptRef.current);
    }
  };

  const formatCurrency = (amount: number): string => {
    return `${amount.toFixed(2).replace(".", ",")} €`;
  };

  return (
    <motion.div
      className={styles.container}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className={styles.header}>
        <button className={styles.calendarButton} onClick={onShowCalendar}>
          <FaCalendarAlt className={styles.icon} />
          Mostrar el calendario
        </button>

        <button className={styles.pdfButton} onClick={handleGeneratePDF}>
          <FaDownload className={styles.icon} />
          Generar PDF
        </button>
      </div>

      <div ref={receiptRef} className={styles.receipt}>
        <motion.section
          className={styles.section}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <h2 className={styles.sectionTitle}>El huésped ha pagado</h2>

          <div className={styles.lineItem}>
            <span className={styles.description}>
              {formatCurrency(data.guestPayment.pricePerNight)} x{" "}
              {data.guestPayment.nights} noches
            </span>
            <span className={styles.amount}>
              {formatCurrency(data.guestPayment.totalAccommodation)}
            </span>
          </div>

          <div className={styles.lineItem}>
            <span className={styles.description}>Gastos de limpieza</span>
            <span className={styles.amount}>
              {formatCurrency(data.guestPayment.cleaningFees)}
            </span>
          </div>

          <div className={styles.lineItem}>
            <span className={styles.description}>
              Comisión de servicio del huésped
            </span>
            <span className={styles.amount}>
              {formatCurrency(data.guestPayment.serviceCommission)}
            </span>
          </div>

          <div className={styles.total}>
            <span className={styles.totalLabel}>Total (EUR)</span>
            <span className={styles.totalAmount}>
              {formatCurrency(data.guestPayment.total)}
            </span>
          </div>
        </motion.section>

        <motion.section
          className={styles.section}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <h2 className={styles.sectionTitle}>Cobro del anfitrión</h2>

          <div className={styles.lineItem}>
            <span className={styles.description}>
              Precio de la habitación por {data.guestPayment.nights} noches
            </span>
            <span className={styles.amount}>
              {formatCurrency(data.hostCollection.accommodationPrice)}
            </span>
          </div>

          <button className={styles.breakdownButton} onClick={onShowBreakdown}>
            <FaEye className={styles.icon} />
            Mostrar desgloses
          </button>

          <div className={styles.lineItem}>
            <span className={styles.description}>Gastos de limpieza</span>
            <span className={styles.amount}>
              {formatCurrency(data.hostCollection.cleaningFees)}
            </span>
          </div>

          <div className={styles.lineItem}>
            <span className={styles.description}>
              Comisión de servicio del anfitrión (
              {data.hostCollection.commissionRate}%)
            </span>
            <span className={`${styles.amount} ${styles.negative}`}>
              {formatCurrency(data.hostCollection.serviceCommission)}
            </span>
          </div>

          <div className={styles.total}>
            <span className={styles.totalLabel}>Total (EUR)</span>
            <span className={styles.totalAmount}>
              {formatCurrency(data.hostCollection.total)}
            </span>
          </div>
        </motion.section>
      </div>
    </motion.div>
  );
};
