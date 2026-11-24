-- Add TMO Kalanki (Thulo Bharyang) and official sources for new licence & exam steps.
insert into public.sources (key, title, url, publisher, last_checked, note) values
 ('bhaktapurNewLicense','New Driving Licence — TMO Radheradhe (Bhaktapur)','https://bhaktapurlicense.bagmati.gov.np/pages/newlicense-8','Transport Management Office, Radheradhe (Bhaktapur), Bagmati Province','2026-11-18','Confirms applydlnew.dotm.gov.np/login booking, printed form + original citizenship for biometrics, and revenue counter hours.'),
 ('bhaktapurWrittenResult','Written Exam Result & Trial Date Notice — TMO Radheradhe (Bhaktapur)','https://bhaktapurlicense.bagmati.gov.np/content/337/as-the-results-of-the-candidates-participating/','Transport Management Office, Radheradhe (Bhaktapur), Bagmati Province','2026-11-18','Confirms written results and Trial Test date booking via applicant user portal.'),
 ('kalankiPortal','TMO Kalanki (Thulo Bharyang) — Official Portal','https://tmokalanki.bagamati.gov.np/carousel-detail/1/','Transport Management Office, Kalanki (Thulo Bharyang), Bagmati Province','2026-11-18','Confirms Thulo Bharyang Nagarjun-03 address, phone (+977 1-5249118), email, and Mon-Fri hours.')
on conflict (key) do nothing;

insert into public.offices (slug, name, name_ne, kind, district, address, address_source_id, address_verified_on, phone, phone_source_id, phone_verified_on, hours, hours_source_id, hours_verified_on)
select 'kalanki-thulobharyang','Transport Management Office, Kalanki (Thulo Bharyang)','यातायात व्यवस्था कार्यालय कलंकी, ठूलोभर्‍याङ','office','Kathmandu',
       'Thulo Bharyang, Nagarjun-03, Kathmandu', s.id, '2026-11-18',
       '+977 1-5249118 / tmoKalanki@bagamati.gov.np', s.id, '2026-11-18',
       'Winter (Kartik 16 to Magh 15): Mon-Fri 9:00-16:00. Summer (Magh 16 to Kartik 15): Mon-Fri 9:00-17:00.', s.id, '2026-11-18'
from public.sources s where s.key = 'kalankiPortal'
on conflict (slug) do nothing;
