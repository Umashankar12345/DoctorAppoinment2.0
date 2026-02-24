const mongoose = require('mongoose');
const Clinic = require('./models/clinicModel');
const dotenv = require('dotenv');

dotenv.config();

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ MongoDB Connected');
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

const clinics = [
    // ─── Karnataka ──────────────────────────
    { name: 'Narayana Health City', type: 'hospital', address: 'Bommasandra, Hosur Road', state: 'Karnataka', district: 'Bangalore Urban', phone: '+91 80 71222222', timings: '24 Hours', facilities: ['ICU', 'Emergency', 'Pharmacy', 'Lab', 'Blood Bank', 'Radiology', 'Physiotherapy'], coordinates: [77.6500, 12.8500], rating: 4.8 },
    { name: 'Apollo Hospital Mysore', type: 'hospital', address: 'Nazarbad, Mysore', state: 'Karnataka', district: 'Mysore', phone: '+91 821 2460460', timings: '24 Hours', facilities: ['ICU', 'Emergency', 'Pharmacy', 'Lab', 'Radiology'], coordinates: [76.6394, 12.3100], rating: 4.6 },

    // ─── Maharashtra ────────────────────────
    { name: 'Kokilaben Dhirubhai Ambani Hospital', type: 'hospital', address: 'Andheri West, Mumbai', state: 'Maharashtra', district: 'Mumbai', phone: '+91 22 30999999', timings: '24 Hours', facilities: ['ICU', 'Emergency', 'Pharmacy', 'Lab', 'Blood Bank', 'Radiology', 'MRI', 'CT Scan', 'Cafeteria'], coordinates: [72.8350, 19.1300], rating: 4.9 },
    { name: 'Tata Memorial Hospital', type: 'hospital', address: 'Parel, Mumbai', state: 'Maharashtra', district: 'Mumbai', phone: '+91 22 24177000', timings: '8:00 AM - 8:00 PM', facilities: ['ICU', 'Cancer Center', 'Pharmacy', 'Lab', 'Radiology', 'Chemotherapy', 'Radiation Therapy'], coordinates: [72.8420, 19.0050], rating: 4.9 },
    { name: 'Ruby Hall Clinic', type: 'hospital', address: 'Sassoon Road, Pune', state: 'Maharashtra', district: 'Pune', phone: '+91 20 26163391', timings: '24 Hours', facilities: ['ICU', 'Emergency', 'Pharmacy', 'Lab', 'Blood Bank'], coordinates: [73.8800, 18.5300], rating: 4.7 },

    // ─── Delhi ──────────────────────────────
    { name: 'AIIMS New Delhi', type: 'hospital', address: 'Ansari Nagar, New Delhi', state: 'Delhi', district: 'New Delhi', phone: '+91 11 26588500', timings: '24 Hours', facilities: ['ICU', 'Emergency', 'Pharmacy', 'Lab', 'Blood Bank', 'Radiology', 'MRI', 'Trauma Center', 'Burn Unit'], coordinates: [77.2100, 28.5672], rating: 4.8 },
    { name: 'Sir Ganga Ram Hospital', type: 'hospital', address: 'Rajinder Nagar, New Delhi', state: 'Delhi', district: 'New Delhi', phone: '+91 11 25861020', timings: '24 Hours', facilities: ['ICU', 'Emergency', 'Pharmacy', 'Lab', 'IVF Center', 'Radiology'], coordinates: [77.1850, 28.6400], rating: 4.7 },
    { name: 'Max Super Speciality Hospital', type: 'hospital', address: 'Saket, South Delhi', state: 'Delhi', district: 'South Delhi', phone: '+91 11 26515050', timings: '24 Hours', facilities: ['ICU', 'Emergency', 'Pharmacy', 'Lab', 'Blood Bank', 'Radiology', 'Robotic Surgery'], coordinates: [77.2200, 28.5250], rating: 4.7 },

    // ─── Tamil Nadu ─────────────────────────
    { name: 'Apollo Hospitals Chennai', type: 'hospital', address: 'Greams Road, Chennai', state: 'Tamil Nadu', district: 'Chennai', phone: '+91 44 28293333', timings: '24 Hours', facilities: ['ICU', 'Emergency', 'Pharmacy', 'Lab', 'Blood Bank', 'Radiology', 'Transplant Center'], coordinates: [80.2550, 13.0600], rating: 4.9 },
    { name: 'KMCH Hospital', type: 'hospital', address: 'Avanashi Road, Coimbatore', state: 'Tamil Nadu', district: 'Coimbatore', phone: '+91 422 4323800', timings: '24 Hours', facilities: ['ICU', 'Emergency', 'Pharmacy', 'Lab', 'Radiology', 'Dialysis'], coordinates: [76.9700, 11.0200], rating: 4.7 },

    // ─── Telangana ──────────────────────────
    { name: 'KIMS Hospitals', type: 'hospital', address: 'Minister Road, Secunderabad', state: 'Telangana', district: 'Hyderabad', phone: '+91 40 44885000', timings: '24 Hours', facilities: ['ICU', 'Emergency', 'Pharmacy', 'Lab', 'Blood Bank', 'Radiology', 'Neuro Lab'], coordinates: [78.5000, 17.4400], rating: 4.7 },
    { name: 'MGM Hospital Warangal', type: 'hospital', address: 'Warangal', state: 'Telangana', district: 'Warangal', phone: '+91 870 2461333', timings: '24 Hours', facilities: ['ICU', 'Emergency', 'Lab', 'Pharmacy'], coordinates: [79.5941, 17.9800], rating: 4.3 },

    // ─── Kerala ─────────────────────────────
    { name: 'Amrita Hospital Kochi', type: 'hospital', address: 'Ponekkara, Kochi', state: 'Kerala', district: 'Kochi', phone: '+91 484 2851234', timings: '24 Hours', facilities: ['ICU', 'Emergency', 'Pharmacy', 'Lab', 'Blood Bank', 'Radiology', 'Ayurveda Wing'], coordinates: [76.2900, 10.0300], rating: 4.8 },
    { name: 'Sree Chitra Tirunal Hospital', type: 'hospital', address: 'Medical College PO, Thiruvananthapuram', state: 'Kerala', district: 'Thiruvananthapuram', phone: '+91 471 2524601', timings: '24 Hours', facilities: ['ICU', 'Cardiology', 'Neurology', 'Lab', 'Pharmacy'], coordinates: [76.9500, 8.5300], rating: 4.7 },

    // ─── Gujarat ────────────────────────────
    { name: 'Sterling Hospital', type: 'hospital', address: 'Gurukul Road, Ahmedabad', state: 'Gujarat', district: 'Ahmedabad', phone: '+91 79 40011111', timings: '24 Hours', facilities: ['ICU', 'Emergency', 'Pharmacy', 'Lab', 'Radiology', 'ENT OT'], coordinates: [72.5500, 23.0400], rating: 4.6 },

    // ─── West Bengal ────────────────────────
    { name: 'AMRI Hospital Kolkata', type: 'hospital', address: 'Dhakuria, Kolkata', state: 'West Bengal', district: 'Kolkata', phone: '+91 33 66800000', timings: '24 Hours', facilities: ['ICU', 'Emergency', 'Pharmacy', 'Lab', 'Radiology', 'Dialysis'], coordinates: [88.3700, 22.5100], rating: 4.6 },

    // ─── Rajasthan ──────────────────────────
    { name: 'SMS Hospital Jaipur', type: 'hospital', address: 'JLN Marg, Jaipur', state: 'Rajasthan', district: 'Jaipur', phone: '+91 141 2560291', timings: '24 Hours', facilities: ['ICU', 'Emergency', 'Pharmacy', 'Lab', 'Blood Bank', 'Trauma Center'], coordinates: [75.8000, 26.9200], rating: 4.5 },

    // ─── Uttar Pradesh ──────────────────────
    { name: 'KGMU Hospital', type: 'hospital', address: 'Shah Mina Road, Lucknow', state: 'Uttar Pradesh', district: 'Lucknow', phone: '+91 522 2257540', timings: '24 Hours', facilities: ['ICU', 'Emergency', 'Pharmacy', 'Lab', 'Blood Bank', 'Pulmonary Lab'], coordinates: [80.9500, 26.8500], rating: 4.6 },

    // ─── Punjab ─────────────────────────────
    { name: 'DMC Hospital', type: 'hospital', address: 'Tagore Nagar, Ludhiana', state: 'Punjab', district: 'Ludhiana', phone: '+91 161 2302620', timings: '8:00 AM - 8:00 PM', facilities: ['Dental OT', 'Lab', 'Pharmacy', 'X-Ray', 'Orthodontics'], coordinates: [75.8600, 30.9100], rating: 4.5 },

    // ─── Madhya Pradesh ─────────────────────
    { name: 'Bansal Hospital', type: 'hospital', address: 'C Sector, Shahpura, Bhopal', state: 'Madhya Pradesh', district: 'Bhopal', phone: '+91 755 4088888', timings: '24 Hours', facilities: ['ICU', 'Emergency', 'Pharmacy', 'Lab', 'Radiology', 'Endocrinology Lab'], coordinates: [77.4300, 23.2100], rating: 4.7 },

    // ─── Bihar ──────────────────────────────
    { name: 'PMCH Patna', type: 'hospital', address: 'Ashok Rajpath, Patna', state: 'Bihar', district: 'Patna', phone: '+91 612 2300343', timings: '24 Hours', facilities: ['ICU', 'Emergency', 'Pharmacy', 'Lab', 'Dialysis', 'Blood Bank'], coordinates: [85.1400, 25.6200], rating: 4.4 },

    // ─── Haryana ────────────────────────────
    { name: 'Fortis Memorial Hospital', type: 'hospital', address: 'Sector 44, Gurugram', state: 'Haryana', district: 'Gurugram', phone: '+91 124 4962200', timings: '24 Hours', facilities: ['ICU', 'Emergency', 'Pharmacy', 'Lab', 'Radiology', 'Sports Medicine', 'Physiotherapy'], coordinates: [77.0300, 28.4500], rating: 4.8 },

    // ─── Odisha ─────────────────────────────
    { name: 'AIIMS Bhubaneswar', type: 'hospital', address: 'Sijua, Bhubaneswar', state: 'Odisha', district: 'Bhubaneswar', phone: '+91 674 2476222', timings: '24 Hours', facilities: ['ICU', 'Emergency', 'Pharmacy', 'Lab', 'Trauma Center', 'Radiology'], coordinates: [85.8200, 20.2900], rating: 4.7 },

    // ─── Assam ──────────────────────────────
    { name: 'GNRC Hospital', type: 'hospital', address: 'Dispur, Guwahati', state: 'Assam', district: 'Guwahati', phone: '+91 361 2228888', timings: '24 Hours', facilities: ['ICU', 'Emergency', 'Pharmacy', 'Lab', 'Cardiology Lab', 'Blood Bank'], coordinates: [91.7500, 26.1500], rating: 4.6 },

    // ─── Jharkhand ──────────────────────────
    { name: 'Medica Superspecialty Hospital', type: 'hospital', address: 'Ranchi', state: 'Jharkhand', district: 'Ranchi', phone: '+91 651 3566000', timings: '24 Hours', facilities: ['ICU', 'Emergency', 'Pharmacy', 'Lab', 'Radiology'], coordinates: [85.3200, 23.3500], rating: 4.5 },

    // ─── Chhattisgarh ───────────────────────
    { name: 'Ramkrishna Care Hospital', type: 'hospital', address: 'Jawahar Nagar, Raipur', state: 'Chhattisgarh', district: 'Raipur', phone: '+91 771 4091011', timings: '24 Hours', facilities: ['ICU', 'Emergency', 'Pharmacy', 'Lab', 'Orthopedic OT'], coordinates: [81.6300, 21.2500], rating: 4.5 },

    // ─── Uttarakhand ────────────────────────
    { name: 'Max Hospital Dehradun', type: 'hospital', address: 'Mussoorie Road, Dehradun', state: 'Uttarakhand', district: 'Dehradun', phone: '+91 135 7110111', timings: '24 Hours', facilities: ['ICU', 'Emergency', 'Pharmacy', 'Lab', 'Radiology', 'Dermatology Center'], coordinates: [78.0400, 30.3200], rating: 4.6 },

    // ─── Himachal Pradesh ───────────────────
    { name: 'IGMC Shimla', type: 'hospital', address: 'The Ridge, Shimla', state: 'Himachal Pradesh', district: 'Shimla', phone: '+91 177 2804251', timings: '24 Hours', facilities: ['ICU', 'Emergency', 'Pharmacy', 'Lab', 'Blood Bank'], coordinates: [77.1800, 31.1100], rating: 4.4 },

    // ─── Jammu & Kashmir ───────────────────
    { name: 'SKIMS Srinagar', type: 'hospital', address: 'Soura, Srinagar', state: 'Jammu and Kashmir', district: 'Srinagar', phone: '+91 194 2401013', timings: '24 Hours', facilities: ['ICU', 'Emergency', 'Pharmacy', 'Lab', 'Neonatal ICU', 'Radiology'], coordinates: [74.8200, 34.1200], rating: 4.5 },

    // ─── Goa ────────────────────────────────
    { name: 'Goa Medical College', type: 'hospital', address: 'Bambolim, Goa', state: 'Goa', district: 'North Goa', phone: '+91 832 2458700', timings: '24 Hours', facilities: ['ICU', 'Emergency', 'Pharmacy', 'Lab', 'Dental Wing', 'Blood Bank'], coordinates: [73.8600, 15.4600], rating: 4.4 },

    // ─── Chandigarh ─────────────────────────
    { name: 'PGI Chandigarh', type: 'hospital', address: 'Sector 12, Chandigarh', state: 'Chandigarh', district: 'Chandigarh', phone: '+91 172 2746018', timings: '24 Hours', facilities: ['ICU', 'Emergency', 'Pharmacy', 'Lab', 'Blood Bank', 'Radiology', 'Neuro Center', 'Trauma Center'], coordinates: [76.7800, 30.7600], rating: 4.8 },
];

const seedClinics = async () => {
    await connectDB();

    try {
        let created = 0;
        let skipped = 0;

        for (const c of clinics) {
            const exists = await Clinic.findOne({ name: c.name, state: c.state });
            if (exists) {
                skipped++;
                console.log(`⏭️  Skipped (already exists): ${c.name}`);
                continue;
            }

            await Clinic.create({
                name: c.name,
                type: c.type,
                address: c.address,
                state: c.state,
                district: c.district,
                phone: c.phone,
                timings: c.timings,
                facilities: c.facilities,
                rating: c.rating,
                location: {
                    type: 'Point',
                    coordinates: c.coordinates,
                },
            });
            created++;
            console.log(`🏥 Created: ${c.name} (${c.type}) - ${c.district}, ${c.state}`);
        }

        console.log(`\n🎉 Clinic seeding complete! Created: ${created}, Skipped: ${skipped}`);
        console.log(`📊 Total clinics in DB: ${await Clinic.countDocuments()}`);
        process.exit();
    } catch (error) {
        console.error('❌ Seeding failed:', error);
        process.exit(1);
    }
};

seedClinics();
