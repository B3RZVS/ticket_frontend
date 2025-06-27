"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FaSave, FaEdit, FaCalculator } from "react-icons/fa";
import type { BookingData } from "../../types/booking";
import styles from "./DataForm.module.css";

interface DataFormProps {
  initialData?: BookingData;
  onDataSubmit: (data: BookingData) => void;
  onToggleForm?: () => void;
}

export const DataForm: React.FC<DataFormProps> = ({
  initialData,
  onDataSubmit,
  onToggleForm,
}) => {
  const [formData, setFormData] = useState<BookingData>({
    guestPayment: {
      pricePerNight: 0,
      nights: 1,
      totalAccommodation: 0,
      cleaningFees: 0,
      serviceCommission: 0,
      total: 0,
    },
    hostCollection: {
      accommodationPrice: 0,
      cleaningFees: 0,
      serviceCommission: 0,
      commissionRate: 15.0,
      total: 0,
    },
    bookingId: "",
    checkIn: "",
    checkOut: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  // Auto-calculate totals when relevant fields change
  useEffect(() => {
    const guestTotal =
      formData.guestPayment.pricePerNight * formData.guestPayment.nights;
    const hostCommission =
      (guestTotal * formData.hostCollection.commissionRate) / 100;

    setFormData((prev) => ({
      ...prev,
      guestPayment: {
        ...prev.guestPayment,
        totalAccommodation: guestTotal,
        total:
          guestTotal +
          prev.guestPayment.cleaningFees +
          prev.guestPayment.serviceCommission,
      },
      hostCollection: {
        ...prev.hostCollection,
        accommodationPrice: guestTotal,
        serviceCommission: -hostCommission,
        total: guestTotal + prev.hostCollection.cleaningFees - hostCommission,
      },
    }));
  }, [
    formData.guestPayment.pricePerNight,
    formData.guestPayment.nights,
    formData.guestPayment.cleaningFees,
    formData.guestPayment.serviceCommission,
    formData.hostCollection.cleaningFees,
    formData.hostCollection.commissionRate,
  ]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (formData.guestPayment.pricePerNight <= 0) {
      newErrors.pricePerNight = "El precio por noche debe ser mayor a 0";
    }

    if (formData.guestPayment.nights <= 0) {
      newErrors.nights = "El número de noches debe ser mayor a 0";
    }

    if (
      formData.hostCollection.commissionRate < 0 ||
      formData.hostCollection.commissionRate > 100
    ) {
      newErrors.commissionRate = "La comisión debe estar entre 0 y 100%";
    }

    if (!formData.bookingId?.trim()) {
      newErrors.bookingId = "El ID de reserva es requerido";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onDataSubmit(formData);
      if (onToggleForm) {
        onToggleForm();
      }
    }
  };

  const handleInputChange = (
    section: keyof BookingData,
    field: string,
    value: string | number
  ) => {
    if (section === "guestPayment" || section === "hostCollection") {
      setFormData((prev) => ({
        ...prev,
        [section]: {
          ...prev[section],
          [field]:
            typeof value === "string" ? Number.parseFloat(value) || 0 : value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [field]: value,
      }));
    }

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  return (
    <motion.div
      className={styles.container}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className={styles.header}>
        <h2 className={styles.title}>
          <FaEdit className={styles.titleIcon} />
          Cargar Datos de Reserva
        </h2>
        {onToggleForm && (
          <button
            type="button"
            className={styles.closeButton}
            onClick={onToggleForm}
          >
            ×
          </button>
        )}
      </div>

      <form onSubmit={handleSubmit} className={styles.form}>
        <motion.section
          className={styles.section}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <h3 className={styles.sectionTitle}>Información General</h3>

          <div className={styles.row}>
            <div className={styles.field}>
              <label className={styles.label}>ID de Reserva</label>
              <input
                type="text"
                className={`${styles.input} ${
                  errors.bookingId ? styles.inputError : ""
                }`}
                value={formData.bookingId || ""}
                onChange={(e) =>
                  handleInputChange(
                    "bookingId" as keyof BookingData,
                    "bookingId",
                    e.target.value
                  )
                }
                placeholder="BK-2024-001"
              />
              {errors.bookingId && (
                <span className={styles.error}>{errors.bookingId}</span>
              )}
            </div>
          </div>

          <div className={styles.row}>
            <div className={styles.field}>
              <label className={styles.label}>Check-in</label>
              <input
                type="date"
                className={styles.input}
                value={formData.checkIn || ""}
                onChange={(e) =>
                  handleInputChange(
                    "checkIn" as keyof BookingData,
                    "checkIn",
                    e.target.value
                  )
                }
              />
            </div>
            <div className={styles.field}>
              <label className={styles.label}>Check-out</label>
              <input
                type="date"
                className={styles.input}
                value={formData.checkOut || ""}
                onChange={(e) =>
                  handleInputChange(
                    "checkOut" as keyof BookingData,
                    "checkOut",
                    e.target.value
                  )
                }
              />
            </div>
          </div>
        </motion.section>

        <motion.section
          className={styles.section}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <h3 className={styles.sectionTitle}>Pago del Huésped</h3>

          <div className={styles.row}>
            <div className={styles.field}>
              <label className={styles.label}>Precio por Noche (€)</label>
              <input
                type="number"
                step="0.01"
                min="0"
                className={`${styles.input} ${
                  errors.pricePerNight ? styles.inputError : ""
                }`}
                value={formData.guestPayment.pricePerNight}
                onChange={(e) =>
                  handleInputChange(
                    "guestPayment",
                    "pricePerNight",
                    e.target.value
                  )
                }
                placeholder="899.67"
              />
              {errors.pricePerNight && (
                <span className={styles.error}>{errors.pricePerNight}</span>
              )}
            </div>
            <div className={styles.field}>
              <label className={styles.label}>Número de Noches</label>
              <input
                type="number"
                min="1"
                className={`${styles.input} ${
                  errors.nights ? styles.inputError : ""
                }`}
                value={formData.guestPayment.nights}
                onChange={(e) =>
                  handleInputChange("guestPayment", "nights", e.target.value)
                }
                placeholder="3"
              />
              {errors.nights && (
                <span className={styles.error}>{errors.nights}</span>
              )}
            </div>
          </div>

          <div className={styles.row}>
            <div className={styles.field}>
              <label className={styles.label}>Gastos de Limpieza (€)</label>
              <input
                type="number"
                step="0.01"
                min="0"
                className={styles.input}
                value={formData.guestPayment.cleaningFees}
                onChange={(e) =>
                  handleInputChange(
                    "guestPayment",
                    "cleaningFees",
                    e.target.value
                  )
                }
                placeholder="120.00"
              />
            </div>
            <div className={styles.field}>
              <label className={styles.label}>Comisión de Servicio (€)</label>
              <input
                type="number"
                step="0.01"
                min="0"
                className={styles.input}
                value={formData.guestPayment.serviceCommission}
                onChange={(e) =>
                  handleInputChange(
                    "guestPayment",
                    "serviceCommission",
                    e.target.value
                  )
                }
                placeholder="0.00"
              />
            </div>
          </div>

          <div className={styles.calculatedField}>
            <FaCalculator className={styles.calcIcon} />
            <span className={styles.calcLabel}>Total Huésped:</span>
            <span className={styles.calcValue}>
              {formData.guestPayment.total.toFixed(2).replace(".", ",")} €
            </span>
          </div>
        </motion.section>

        <motion.section
          className={styles.section}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <h3 className={styles.sectionTitle}>Cobro del Anfitrión</h3>

          <div className={styles.row}>
            <div className={styles.field}>
              <label className={styles.label}>Gastos de Limpieza (€)</label>
              <input
                type="number"
                step="0.01"
                min="0"
                className={styles.input}
                value={formData.hostCollection.cleaningFees}
                onChange={(e) =>
                  handleInputChange(
                    "hostCollection",
                    "cleaningFees",
                    e.target.value
                  )
                }
                placeholder="120.00"
              />
            </div>
            <div className={styles.field}>
              <label className={styles.label}>Tasa de Comisión (%)</label>
              <input
                type="number"
                step="0.1"
                min="0"
                max="100"
                className={`${styles.input} ${
                  errors.commissionRate ? styles.inputError : ""
                }`}
                value={formData.hostCollection.commissionRate}
                onChange={(e) =>
                  handleInputChange(
                    "hostCollection",
                    "commissionRate",
                    e.target.value
                  )
                }
                placeholder="15.0"
              />
              {errors.commissionRate && (
                <span className={styles.error}>{errors.commissionRate}</span>
              )}
            </div>
          </div>

          <div className={styles.calculatedField}>
            <FaCalculator className={styles.calcIcon} />
            <span className={styles.calcLabel}>Comisión Calculada:</span>
            <span className={`${styles.calcValue} ${styles.negative}`}>
              {Math.abs(formData.hostCollection.serviceCommission)
                .toFixed(2)
                .replace(".", ",")}{" "}
              €
            </span>
          </div>

          <div className={styles.calculatedField}>
            <FaCalculator className={styles.calcIcon} />
            <span className={styles.calcLabel}>Total Anfitrión:</span>
            <span className={styles.calcValue}>
              {formData.hostCollection.total.toFixed(2).replace(".", ",")} €
            </span>
          </div>
        </motion.section>

        <motion.div
          className={styles.actions}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <button type="submit" className={styles.submitButton}>
            <FaSave className={styles.buttonIcon} />
            Guardar y Generar Recibo
          </button>
        </motion.div>
      </form>
    </motion.div>
  );
};
