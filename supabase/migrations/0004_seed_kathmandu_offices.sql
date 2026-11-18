-- Add verified Kathmandu Valley transport offices and official sources.
-- Run in Supabase SQL Editor so citizen reports can target all 5 offices.

insert into public.sources (key, title, url, publisher, last_checked, note) values
 ('bhaktapurPortal','Transport Management Office, Radheradhe (Bhaktapur) — Official Portal','https://bhaktapurlicense.bagmati.gov.np/','Ministry of Industry, Tourism, Labour and Transport, Bagmati Province','2026-11-18','Confirms address (Radheradhe, Bhaktapur), phone (01-6637073), email, and Mon-Fri hours.'),
 ('bhaktapurRenewal','Licence Renewal Information — TMO Radheradhe (Bhaktapur)','https://bhaktapurlicense.bagmati.gov.np/pages/licenserenewal-10/','Transport Management Office, Radheradhe (Bhaktapur), Bagmati Province','2026-11-18','Confirms in-person original licence + citizenship requirement, 90-day window, and 100%-500% late fines.'),
 ('ekantakunaContact','Contact Us — TMO (Driving Licence), Ekantakuna (Lalitpur)','https://ekantakunalicense.bagamati.gov.np/contact-us/','Transport Management Office (Driving Licence), Ekantakuna, Bagmati Province','2026-11-18','Confirms address, phone (01-5193173), toll-free (18105000137), email, and Mon-Fri hours.'),
 ('chabahilPortal','TMO (Driving Licence), Chabahil (Kathmandu) — Official Portal','https://chabahillicense.bagamati.gov.np/','Transport Management Office (Driving Licence), Chabahil, Bagmati Province','2026-11-18','Confirms address (Chabahil, Kathmandu), email, and Mon-Fri hours.'),
 ('gurjudharaIntro','Introduction — TMO (Motorcycle), Gurjudhara (Kathmandu)','https://mosa.bagamati.gov.np/pages/introduction/','Transport Management Office (Motorcycle), Gurjudhara, Bagmati Province','2026-11-18','Confirms Chandragiri-5 Gurjudhara address, email, Mon-Fri hours, and two-wheeler registration scope.')
on conflict (key) do nothing;

update public.offices
set name_ne = 'यातायात व्यवस्था विभाग (मुख्य कार्यालय)'
where slug = 'dotm-head-office';

update public.offices o
set
  name_ne = 'यातायात व्यवस्था कार्यालय, राधेराधे (भक्तपुर)',
  address = 'Radheradhe, Bhaktapur',
  address_source_id = s.id,
  address_verified_on = '2026-11-18',
  phone = '01-6637073 / info.bhaktapurlc@dotm.gov.np',
  phone_source_id = s.id,
  phone_verified_on = '2026-11-18',
  hours = 'Winter (Kartik 16 to Magh 15): Mon-Fri 9:00-16:00. Summer (Magh 16 to Kartik 15): Mon-Fri 9:00-17:00.',
  hours_source_id = s.id,
  hours_verified_on = '2026-11-18'
from public.sources s
where o.slug = 'radheradhe-bhaktapur' and s.key = 'bhaktapurPortal';

insert into public.offices (slug, name, name_ne, kind, district, address, address_source_id, address_verified_on, phone, phone_source_id, phone_verified_on, hours, hours_source_id, hours_verified_on)
select 'ekantakuna-lalitpur','Transport Management Office (Driving Licence), Ekantakuna (Lalitpur)','यातायात व्यवस्था कार्यालय (सवारी चालक अनुमतिपत्र), एकान्तकुना (ललितपुर)','office','Lalitpur',
       'Ekantakuna, Lalitpur', s.id, '2026-11-18',
       '01-5193173 / Toll-free: 18105000137 / tmodlekantakuna@bagamati.gov.np', s.id, '2026-11-18',
       'Winter (Kartik 16 to Magh 15): Mon-Fri 9:00-16:00. Summer (Magh 16 to Kartik 15): Mon-Fri 9:00-17:00.', s.id, '2026-11-18'
from public.sources s where s.key = 'ekantakunaContact'
on conflict (slug) do nothing;

insert into public.offices (slug, name, name_ne, kind, district, address, address_source_id, address_verified_on, phone, phone_source_id, phone_verified_on, hours, hours_source_id, hours_verified_on)
select 'chabahil-kathmandu','Transport Management Office (Driving Licence), Chabahil (Kathmandu)','यातायात व्यवस्था कार्यालय (सवारी चालक अनुमतिपत्र), चाबहिल (काठमाडौं)','office','Kathmandu',
       'Chabahil, Kathmandu', s.id, '2026-11-18',
       'tmodlchabahil@bagamati.gov.np', s.id, '2026-11-18',
       'Winter (Kartik 16 to Magh 15): Mon-Fri 9:00-16:00. Summer (Magh 16 to Kartik 15): Mon-Fri 9:00-17:00.', s.id, '2026-11-18'
from public.sources s where s.key = 'chabahilPortal'
on conflict (slug) do nothing;

insert into public.offices (slug, name, name_ne, kind, district, address, address_source_id, address_verified_on, phone, phone_source_id, phone_verified_on, hours, hours_source_id, hours_verified_on)
select 'gurjudhara-kathmandu','Transport Management Office (Motorcycle), Gurjudhara (Kathmandu)','यातायात व्यवस्था कार्यालय (मोटरसाइकल), गुर्जुधारा (काठमाडौं)','office','Kathmandu',
       'Chandragiri Municipality Ward No. 5, Gurjudhara, Kathmandu', s.id, '2026-11-18',
       'tmomosakathmandu@bagamati.gov.np', s.id, '2026-11-18',
       'Winter (Kartik 16 to Magh 15): Mon-Fri 9:00-16:00. Summer (Magh 16 to Kartik 15): Mon-Fri 9:00-17:00.', s.id, '2026-11-18'
from public.sources s where s.key = 'gurjudharaIntro'
on conflict (slug) do nothing;
