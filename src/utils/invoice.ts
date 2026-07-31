import { jsPDF } from 'jspdf';
import { Order } from '../types';

export function generateGSTInvoice(order: Order) {
  const doc = new jsPDF();

  // Header Background
  doc.setFillColor(255, 107, 0); // #FF6B00 Orange
  doc.rect(0, 0, 210, 32, 'F');

  // Title
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(22);
  doc.setFont('helvetica', 'bold');
  doc.text('MS BULLET HUB AUTOMOTIVE', 14, 18);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text('GSTIN: 21AABCP9981Z1ZP | Customer Support: +91 1800-419-7700', 14, 25);

  doc.setTextColor(0, 0, 0);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('TAX INVOICE / BILL OF SUPPLY', 14, 42);

  // Invoice Details Box
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.text(`Invoice No: ${order.orderNumber}`, 14, 52);
  doc.text(`Date: ${new Date(order.createdAt).toLocaleDateString('en-IN')}`, 14, 58);
  doc.text(`Payment Method: ${order.paymentMethod} (${order.paymentStatus})`, 14, 64);
  
  doc.text(`Billed To (Customer):`, 120, 52);
  doc.setFont('helvetica', 'normal');
  doc.text(`${order.customerName}`, 120, 58);
  doc.text(`Mobile: ${order.mobile}`, 120, 64);
  doc.text(`Address: ${order.address}, ${order.city}`, 120, 70);
  doc.text(`${order.state} - ${order.pincode}`, 120, 76);

  if (order.vehicleInfo) {
    doc.setFont('helvetica', 'bold');
    doc.text(`Vehicle Tag: ${order.vehicleInfo}`, 14, 76);
  }

  // Table Headers
  let y = 88;
  doc.setFillColor(240, 240, 240);
  doc.rect(14, y, 182, 8, 'F');
  doc.setFont('helvetica', 'bold');
  doc.text('Item Description', 18, y + 5.5);
  doc.text('OEM / HSN', 90, y + 5.5);
  doc.text('Qty', 130, y + 5.5);
  doc.text('Rate (₹)', 148, y + 5.5);
  doc.text('Amount (₹)', 172, y + 5.5);

  y += 12;
  doc.setFont('helvetica', 'normal');

  order.items.forEach((item) => {
    const title = item.product.name.length > 38 ? item.product.name.substring(0, 35) + '...' : item.product.name;
    const hsn = `${item.product.hsnCode} / ${item.product.oemNumber}`;
    const rate = item.product.price;
    const itemTotal = rate * item.quantity;

    doc.text(title, 18, y);
    doc.text(hsn, 90, y);
    doc.text(`${item.quantity}`, 132, y);
    doc.text(`₹${rate}`, 148, y);
    doc.text(`₹${itemTotal.toLocaleString('en-IN')}`, 172, y);

    y += 8;
  });

  // Summary Lines
  y += 6;
  doc.line(14, y, 196, y);
  y += 6;

  doc.setFont('helvetica', 'normal');
  doc.text('Subtotal:', 130, y);
  doc.text(`₹${order.subtotal.toLocaleString('en-IN')}`, 172, y);
  
  if (order.discount > 0) {
    y += 6;
    doc.text(`Discount (${order.couponCode || 'Promo'}):`, 130, y);
    doc.text(`- ₹${order.discount.toLocaleString('en-IN')}`, 172, y);
  }

  y += 6;
  doc.text('GST (Estimated 18%):', 130, y);
  doc.text(`₹${order.gst.toLocaleString('en-IN')}`, 172, y);

  y += 6;
  doc.text('Delivery Charges:', 130, y);
  doc.text(order.shippingFee === 0 ? 'FREE' : `₹${order.shippingFee}`, 172, y);

  y += 8;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text('Grand Total:', 130, y);
  doc.text(`₹${order.grandTotal.toLocaleString('en-IN')}`, 172, y);

  // Footer Note
  y += 20;
  doc.setFontSize(8);
  doc.setFont('helvetica', 'italic');
  doc.text('Thank you for shopping with MS BULLET HUB! This is a computer-generated tax invoice.', 14, y);
  doc.text('For returns & warranty claims, present this invoice within 7 days of delivery.', 14, y + 4);

  doc.save(`Invoice_${order.orderNumber}.pdf`);
}
