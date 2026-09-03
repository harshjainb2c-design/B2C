# 📱 Quick Reference Card - B2C Exports & B2C Kicks

## 🚀 Getting Started (5 Steps)

### 1️⃣ Install & Run (5 minutes)
```bash
cd biz-commerce
npm install
npm run dev
```
Website opens at: http://localhost:5173

### 2️⃣ Set Up Database (30 minutes)
- Go to https://supabase.com
- Create project
- Get API keys
- Add to `.env` file

### 3️⃣ Set Up Payments (Submit documents)
- Go to https://razorpay.com
- Complete KYC (2-3 days)
- Get API keys
- Add to `.env` file

### 4️⃣ Add Products (1 hour)
- Login as admin
- Go to `/admin`
- Click "Add Product"
- Upload images, set prices

### 5️⃣ Deploy (30 minutes)
- Push to GitHub
- Deploy on Vercel
- Add environment variables
- Go live!

---

## 🔑 Important URLs

### Development
- Local: http://localhost:5173
- Admin: http://localhost:5173/admin

### Production (After Deploy)
- Website: your-domain.com
- Admin: your-domain.com/admin

### Services
- Supabase: https://supabase.com
- Razorpay: https://razorpay.com
- Vercel: https://vercel.com

---

## 👤 Admin Access

### Create Admin User
1. Register on website
2. Go to Supabase > Authentication
3. Copy user UUID
4. Run SQL:
```sql
UPDATE auth.users 
SET raw_user_meta_data = jsonb_set(
  COALESCE(raw_user_meta_data, '{}'::jsonb),
  '{role}',
  '"admin"'
)
WHERE id = 'your-uuid-here';
```

### Admin Features
- `/admin` - Dashboard
- Product Manager - Add/Edit/Delete products
- Order Manager - View/Update orders

---

## 📦 Product Management

### Add Product
1. Login as admin
2. Go to Admin > Product Manager
3. Click "Add Product"
4. Fill details:
   - Name
   - Description
   - Price
   - Category
   - Images (URLs)
   - Stock quantity
5. Click "Create Product"

### Edit Product
1. Go to Product Manager
2. Click "Edit" on product
3. Update details
4. Click "Update Product"

### Delete Product
1. Go to Product Manager
2. Click trash icon
3. Confirm deletion

---

## 💳 Payment Setup

### Razorpay KYC Documents
- ✅ PAN Card
- ✅ Bank Account Details
- ✅ GST Certificate OR Shop Act
- ✅ Address Proof
- ✅ Aadhaar Card

### Test Mode
- Use test keys first
- Test card: 4111 1111 1111 1111
- Any CVV, future date

### Live Mode
- After KYC approval
- Switch to live keys
- Real transactions start

---

## 🛒 Order Management

### View Orders
- Admin > Order Manager
- See all customer orders
- Filter by status

### Update Order Status
1. Click on order
2. Change status:
   - Pending
   - Processing
   - Shipped
   - Delivered
   - Cancelled
3. Customer gets notified

---

## 📞 Business Contact Info

**B2C Exports & B2C Kicks**
- 📍 137 Malwa Mill, Opposite Bank of India
- 📍 Indore, MP - 452005
- 📞 +91 9098178762
- 📞 +91 7489741505
- 📧 harshjain2904@gmail.com
- 📱 @b2cexports_since_2018

**Hours:**
- Mon-Sat: 10 AM - 8 PM
- Sunday: 11 AM - 6 PM

---

## 🚚 Shipping Info

- Free shipping: Orders ≥ ₹2,000
- Delivery charge: ₹50 (orders < ₹2,000)
- Delivery time: 1-2 days (Indore)
- Areas: Indore & nearby

---

## 🔧 Common Commands

### Development
```bash
npm run dev          # Start dev server
npm run build        # Build for production
npm run preview      # Preview production build
```

### Deployment
```bash
git add .
git commit -m "Update"
git push origin main
```

---

## 🐛 Troubleshooting

### Website won't start
- Check Node.js installed
- Run `npm install`
- Check `.env` file exists

### Can't login as admin
- Check user role in Supabase
- Run admin SQL query
- Clear browser cache

### Products not showing
- Check Supabase connection
- Verify products added
- Check browser console

### Payment not working
- Check Razorpay keys
- Verify test/live mode
- Check KYC status

---

## 📚 Documentation Files

1. **SETUP_GUIDE.md** - Detailed setup
2. **CLIENT_HANDOVER_CHECKLIST.md** - Complete checklist
3. **DELIVERY_SUMMARY.md** - What's delivered
4. **TECHNICAL_FAQ_FOR_TEAM.md** - Technical help

---

## ✅ Pre-Launch Checklist

- [ ] Supabase set up
- [ ] Razorpay KYC approved
- [ ] Admin user created
- [ ] 20+ products added
- [ ] Test order completed
- [ ] Payment tested
- [ ] Mobile tested
- [ ] Deployed to production
- [ ] Custom domain (optional)
- [ ] Social media announced

---

## 🎯 Quick Tips

### For Best Results
1. Add high-quality product images
2. Write clear descriptions
3. Set competitive prices
4. Keep stock updated
5. Respond to orders quickly
6. Promote on Instagram
7. Offer launch discounts
8. Collect customer feedback

### Marketing
- Share on Instagram stories
- Add link to bio
- WhatsApp status updates
- Inform existing customers
- Print QR codes for store

---

## 🆘 Need Help?

### Check First
1. Documentation files
2. Browser console errors
3. Supabase dashboard
4. Razorpay dashboard

### Still Stuck?
- Review TECHNICAL_FAQ
- Check error messages
- Contact developer

---

## 🎉 Success Metrics

### Week 1
- Website live ✅
- 20+ products ✅
- First order ✅

### Month 1
- 50+ products
- 10+ orders
- Social media active

### Month 3
- 100+ products
- Regular orders
- Growing customer base

---

## 💡 Pro Tips

1. **Start Small** - Add 20 products, test, then add more
2. **Test Everything** - Use test mode before going live
3. **Mobile First** - Most customers use phones
4. **Fast Response** - Reply to orders within 24 hours
5. **Quality Photos** - Good images = more sales
6. **Clear Descriptions** - Help customers decide
7. **Stock Management** - Update stock regularly
8. **Promotions** - Run occasional discounts
9. **Social Proof** - Share customer photos
10. **Stay Active** - Post regularly on Instagram

---

## 📱 Mobile App (Future)

Currently: Mobile-responsive website
Future: Can convert to mobile app using:
- React Native
- Progressive Web App (PWA)
- Capacitor

---

## 🔐 Security Reminders

- ✅ Never share `.env` file
- ✅ Use strong passwords
- ✅ Enable 2FA on accounts
- ✅ Regular backups
- ✅ Keep software updated

---

## 🎊 You're Ready!

Everything is set up and ready to go!

**Next Steps:**
1. Complete Razorpay KYC ⏰
2. Set up Supabase 🗄️
3. Add products 📦
4. Test everything ✅
5. Launch! 🚀

**Good luck with your online business!** 🎉

---

*Keep this card handy for quick reference!*
