-- Add Passport, National ID, Citizenship (DAO Kathmandu), and PAN (IRD)
-- sources, services, and Kathmandu Valley offices.
insert into public.sources (key, title, url, publisher, last_checked, note) values
 ('gurjudharaBluebook','Bluebook Renewal — TMO (Motorcycle), Gurjudhara','https://mosa.bagamati.gov.np/pages/bluebook-renewal/','Transport Management Office (Motorcycle), Gurjudhara, Bagmati Province','2026-11-24','Official page reachable for two-wheeler bluebook renewal.'),
 ('passportPortal','Department of Passports — Official Website','https://nepalpassport.gov.np/','Department of Passports, Government of Nepal','2026-11-24','Confirms Tripureshwor Kathmandu address and enquiry hotline (+977 1-5970330).'),
 ('passportDocs','Where to Apply & Required Documents for e-Passport','https://nepalpassport.gov.np/en/process/process-20','Department of Passports, Government of Nepal','2026-11-24','Confirms regular DAO/AAO vs Tripureshwor fast-track and required documents.'),
 ('passportFees','Revenue for Passport — Department of Passports','https://nepalpassport.gov.np/en/process/process-25','Department of Passports, Government of Nepal','2026-11-24','Confirms official passport revenue schedule.'),
 ('donidcrPortal','Department of National ID and Civil Registration (DoNIDCR)','https://donidcr.gov.np/','Department of National ID and Civil Registration, Government of Nepal','2026-11-24','Confirms Singhadurbar address, Narayanhiti contact, toll-free 1147, and Mon-Fri hours.'),
 ('nidCitizenPortal','National ID Citizen Portal','https://citizenportal.donidcr.gov.np/en','Department of National ID and Civil Registration, Government of Nepal','2026-11-24','Official citizen portal for National ID pre-enrollment and status.'),
 ('daoKathmandu','District Administration Office, Kathmandu — Citizenship Documents','https://daokathmandu.moha.gov.np/en/post/na-pa-l-na-gara-kata-ka-pa-rama-naepata-ra-bna-una-ca-ha-na-ka-gaja-tahara','District Administration Office, Kathmandu','2026-11-24','Confirms Babarmahal address, citizenship phone (01-5971880), and Mon-Fri 9:00-17:00 hours.'),
 ('irdPortal','Inland Revenue Department (IRD) — Official Portal','https://ird.gov.np/','Inland Revenue Department, Government of Nepal','2026-11-24','Confirms Lazimpat address, phone (01-5970081), Mon-Fri hours, and online PAN via NID.')
on conflict (key) do nothing;

insert into public.services (slug, name, name_ne, summary, summary_ne) values
 ('bluebook-renewal','Two-wheeler bluebook renewal & tax','मोटरसाइकल ब्लूबुक नवीकरण तथा कर','Information about two-wheeler vehicle registration, bluebook renewal, and tax in Kathmandu Valley.','काठमाडौं उपत्यकामा दुई पाङ्ग्रे सवारी दर्ता, ब्लूबुक नवीकरण र सवारी कर बारेको जानकारी।'),
 ('epassport-application','e-Passport (New & Renewal)','ई-पासपोर्ट (नयाँ तथा नवीकरण)','Apply for or renew a Nepali e-Passport (regular at DAO or fast-track at Department of Passports, Tripureshwor).','नेपाली ई-पासपोर्ट (नियमित जिल्ला प्रशासन कार्यालय वा द्रुत सेवा राहदानी विभाग, त्रिपुरेश्वर) सम्बन्धी जानकारी।'),
 ('national-id','National Identity Card (NID)','राष्ट्रिय परिचयपत्र (NID)','Online pre-enrollment, biometric registration, and status check for Nepal''s National Identity Card.','राष्ट्रिय परिचयपत्रको अनलाइन प्रि-एनरोलमेन्ट, बायोमेट्रिक दर्ता र स्थिति जाँच बारेको जानकारी।'),
 ('citizenship-certificate','Citizenship certificate','नेपाली नागरिकता प्रमाणपत्र','Official document notices and District Administration Office contact information for Nepali citizenship.','नेपाली नागरिकता प्रमाणपत्र सम्बन्धी आधिकारिक सूचना र जिल्ला प्रशासन कार्यालयको सम्पर्क विवरण।'),
 ('personal-pan','Personal PAN registration','व्यक्तिगत स्थायी लेखा नम्बर (PAN)','Information about Personal PAN registration and online generation using your National ID number via IRD.','आन्तरिक राजस्व विभाग (IRD) मार्फत व्यक्तिगत स्थायी लेखा नम्बर (PAN) दर्ता र अनलाइन सिर्जना सम्बन्धी जानकारी।')
on conflict (slug) do nothing;

insert into public.offices (slug, name, name_ne, kind, district, address, address_source_id, address_verified_on, phone, phone_source_id, phone_verified_on)
select 'department-of-passports-tripureshwor','Department of Passports (Tripureshwor)','राहदानी विभाग (त्रिपुरेश्वर)','department','Kathmandu',
       'Tripureshwor, Kathmandu', s.id, '2026-11-24',
       '+977 1-5970330 / info@nepalpassport.gov.np', s.id, '2026-11-24'
from public.sources s where s.key = 'passportPortal'
on conflict (slug) do nothing;

insert into public.offices (slug, name, name_ne, kind, district, address, address_source_id, address_verified_on, phone, phone_source_id, phone_verified_on, hours, hours_source_id, hours_verified_on)
select 'dao-kathmandu-babarmahal','District Administration Office, Kathmandu (Babarmahal)','जिल्ला प्रशासन कार्यालय, काठमाडौं (बबरमहल)','office','Kathmandu',
       'Babarmahal, Kathmandu', s.id, '2026-11-24',
       '01-5971880 / daobabarmahal@gmail.com', s.id, '2026-11-24',
       'Monday to Friday, 09:00 AM - 5:00 PM', s.id, '2026-11-24'
from public.sources s where s.key = 'daoKathmandu'
on conflict (slug) do nothing;

insert into public.offices (slug, name, name_ne, kind, district, address, address_source_id, address_verified_on, phone, phone_source_id, phone_verified_on, hours, hours_source_id, hours_verified_on)
select 'donidcr-singhadurbar','Department of National ID and Civil Registration (Singhadurbar)','राष्ट्रिय परिचयपत्र तथा पञ्जीकरण विभाग (सिंहदरबार)','department','Kathmandu',
       'Singhadurbar, Kathmandu', s.id, '2026-11-24',
       '01-5970112 / Toll-free: 1147 / nid@donidcr.gov.np', s.id, '2026-11-24',
       'Winter (Kartik 16 to Magh 15): Mon-Fri 9:00-16:00. Summer (Magh 16 to Kartik 15): Mon-Fri 9:00-17:00.', s.id, '2026-11-24'
from public.sources s where s.key = 'donidcrPortal'
on conflict (slug) do nothing;

insert into public.offices (slug, name, name_ne, kind, district, address, address_source_id, address_verified_on, phone, phone_source_id, phone_verified_on, hours, hours_source_id, hours_verified_on)
select 'ird-lazimpat','Inland Revenue Department (Lazimpat)','आन्तरिक राजस्व विभाग (लाजिम्पाट)','department','Kathmandu',
       'Lazimpat, Kathmandu', s.id, '2026-11-24',
       '01-5970081 / serviceird@ird.gov.np', s.id, '2026-11-24',
       'Winter (Kartik 16 to Magh 15): Mon-Fri 9:00-16:00. Summer (Magh 16 to Kartik 15): Mon-Fri 9:00-17:00.', s.id, '2026-11-24'
from public.sources s where s.key = 'irdPortal'
on conflict (slug) do nothing;
