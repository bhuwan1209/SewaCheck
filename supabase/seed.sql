-- Seed: ONLY information already verified from official sources (see src/data).
-- Services have no requirement rows on purpose: none are confirmed yet.
-- Run after 0001_init.sql.

insert into public.sources (key, title, url, publisher, last_checked, note) values
 ('dotmHome','Department of Transport Management (official website)','https://www.dotm.gov.np/','Department of Transport Management, Government of Nepal','2026-11-17','Website reachable. Used as the starting point for official information.'),
 ('citizenCharter','Citizen Charter','https://www.dotm.gov.np/pages/citizen-charter','Department of Transport Management, Government of Nepal','2026-11-17','Page reachable. Gives head office address and office hours. No service documents or fees in readable text.'),
 ('edlvrsNotice','Notice about the online EDLVRS licence and vehicle registration system','https://www.dotm.gov.np/content/106/driver-s-license/','Department of Transport Management, Government of Nepal','2026-11-17','Page exists (title seen). Contents not yet reviewed.'),
 ('writtenExamQuestions','Written examination questions for class (B), 2082-83','https://www.dotm.gov.np/content/111/-b--written-examination-questions-for-class-2082-83/','Department of Transport Management, Government of Nepal','2026-11-17','Page exists; contents not yet reviewed.'),
 ('dotmOfficeContacts','Transport offices contact details (category page)','https://www.dotm.gov.np/category/transport-offices-contacts/','Department of Transport Management, Government of Nepal','2026-11-17','Page reachable but showed no office list in readable text.'),
 ('radheradhePrinted','Printed licences notice: Radheradhe (Bhaktapur) office','https://www.dotm.gov.np/content/85/regular-print-license-radheradhe2/','Department of Transport Management, Government of Nepal','2026-11-17','Confirms an office named Radheradhe (Bhaktapur) exists. No address, phone or hours.');

insert into public.services (slug, name, summary) values
 ('driving-licence','Driving licence','Information about applying for a new driving licence.'),
 ('licence-renewal','Licence renewal','Information about renewing an existing driving licence.'),
 ('written-examination','Written examination','Information about the written (theory) driving examination.'),
 ('trial-examination','Trial examination','Information about the practical driving (trial) examination.');

insert into public.offices (slug, name, kind, district, address, address_source_id, address_verified_on, hours, hours_source_id, hours_verified_on)
select 'dotm-head-office','Department of Transport Management (head office)','department','Kathmandu',
       'Minbhawan, Kathmandu', s.id, '2026-11-17',
       'Winter (Kartik 16 to Magh 15): Mon-Fri 9:00-16:00. Summer (Magh 16 to Kartik 15): Mon-Fri 9:00-17:00. Department hours; a transport office may differ.',
       s.id, '2026-11-17'
from public.sources s where s.key = 'citizenCharter';

insert into public.offices (slug, name, kind, district)
values ('radheradhe-bhaktapur','Transport Management Office, Radheradhe (Bhaktapur)','office','Bhaktapur');
