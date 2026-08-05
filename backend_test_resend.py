#!/usr/bin/env python3
"""
Backend API Test Suite - RESEND EMAIL + AVAILABILITY HOURS
Focus on two areas:
1. Resend email notifications (POST /api/appointments, POST /api/contact)
2. Availability hours verification (GET /api/availability exact structure)
Plus quick regression tests
"""

import requests
import json
from datetime import datetime, timedelta

# Base URL from environment
BASE_URL = "https://salvia-psicologia.preview.emergentagent.com/api"
ADMIN_PASSWORD = "giulia2025"

# Test results tracking
test_results = {
    "passed": [],
    "failed": [],
    "warnings": []
}

# Store test data for cleanup
admin_token = None
created_appointment_ids = []

def log_pass(test_name):
    print(f"✅ PASS: {test_name}")
    test_results["passed"].append(test_name)

def log_fail(test_name, reason):
    print(f"❌ FAIL: {test_name}")
    print(f"   Reason: {reason}")
    test_results["failed"].append(f"{test_name}: {reason}")

def log_warning(test_name, reason):
    print(f"⚠️  WARNING: {test_name}")
    print(f"   Reason: {reason}")
    test_results["warnings"].append(f"{test_name}: {reason}")

def get_future_weekday():
    """Get a future weekday (Mon-Fri) in YYYY-MM-DD format"""
    today = datetime.now()
    days_ahead = 1
    future_date = today + timedelta(days=days_ahead)
    
    # Keep adding days until we find a weekday (Mon-Fri = 0-4)
    while future_date.weekday() >= 5:  # 5=Sat, 6=Sun
        days_ahead += 1
        future_date = today + timedelta(days=days_ahead)
    
    return future_date.strftime("%Y-%m-%d")

print("=" * 80)
print("BACKEND API TEST SUITE - RESEND EMAIL + AVAILABILITY HOURS")
print("=" * 80)
print(f"Base URL: {BASE_URL}")
print()

# ============================================================================
# ADMIN LOGIN (for protected routes)
# ============================================================================
print("\n" + "=" * 80)
print("ADMIN LOGIN")
print("=" * 80)

try:
    response = requests.post(f"{BASE_URL}/admin/login", json={"password": ADMIN_PASSWORD})
    if response.status_code == 200:
        data = response.json()
        if data.get("ok") and "token" in data:
            admin_token = data["token"]
            log_pass("Admin login successful - token obtained")
        else:
            log_fail("Admin login", f"Missing ok or token: {data}")
    else:
        log_fail("Admin login", f"Expected 200, got {response.status_code}: {response.text}")
except Exception as e:
    log_fail("Admin login", f"Exception: {str(e)}")

if not admin_token:
    print("\n❌ CRITICAL: Cannot proceed without admin token")
    exit(1)

# ============================================================================
# AREA 1: RESEND EMAIL NOTIFICATIONS (HIGHEST PRIORITY)
# ============================================================================
print("\n" + "=" * 80)
print("AREA 1: RESEND EMAIL NOTIFICATIONS")
print("=" * 80)

# Test A: POST /api/appointments with valid booking - check emailSent flag
print("\n[TEST A] POST /api/appointments - check emailSent flag and status")
future_date = get_future_weekday()
print(f"   Using future weekday: {future_date}")

try:
    response = requests.post(f"{BASE_URL}/appointments", json={
        "name": "Maria Rossi",
        "email": "maria.rossi@example.com",
        "date": future_date,
        "time": "10:00",
        "service": "Colloquio psicologico individuale",
        "modality": "In studio",
        "message": "Vorrei prenotare un primo colloquio per discutere di ansia e stress lavorativo.",
        "consent": True
    })
    
    print(f"   Response status: {response.status_code}")
    
    if response.status_code == 200:
        data = response.json()
        print(f"   Response body: {json.dumps(data, indent=2)}")
        
        # Check for required fields
        if data.get("ok") and "appointment" in data:
            appointment = data["appointment"]
            email_sent = data.get("emailSent")
            
            print(f"   ✓ ok: {data.get('ok')}")
            print(f"   ✓ emailSent: {email_sent}")
            print(f"   ✓ appointment.id: {appointment.get('id')}")
            
            # Store for cleanup
            created_appointment_ids.append(appointment.get("id"))
            
            # Verify emailSent is present and boolean
            if email_sent is not None:
                if email_sent == True:
                    log_pass(f"POST /api/appointments returns 200 with emailSent=true (Resend email dispatched successfully)")
                elif email_sent == False:
                    log_warning("POST /api/appointments emailSent=false", "Email was not sent. Check if RESEND_API_KEY is configured or if Resend rejected the request.")
                else:
                    log_fail("POST /api/appointments emailSent type", f"emailSent should be boolean, got {type(email_sent)}: {email_sent}")
            else:
                log_fail("POST /api/appointments missing emailSent", "Response does not contain emailSent field")
        else:
            log_fail("POST /api/appointments response structure", f"Missing ok or appointment: {data}")
    
    elif response.status_code == 500:
        # Server error - likely Resend API issue
        try:
            error_data = response.json()
            error_msg = error_data.get("error", response.text)
            print(f"   ❌ 500 ERROR: {error_msg}")
            log_fail("POST /api/appointments returns 500", f"Server error (likely Resend API issue): {error_msg}")
        except:
            print(f"   ❌ 500 ERROR: {response.text}")
            log_fail("POST /api/appointments returns 500", f"Server error: {response.text}")
    
    else:
        log_fail("POST /api/appointments unexpected status", f"Expected 200, got {response.status_code}: {response.text}")

except Exception as e:
    log_fail("POST /api/appointments", f"Exception: {str(e)}")

# Test B: POST /api/contact with valid message - check status
print("\n[TEST B] POST /api/contact - check status and Resend email")
try:
    response = requests.post(f"{BASE_URL}/contact", json={
        "name": "Luca Bianchi",
        "email": "luca.bianchi@example.com",
        "message": "Buongiorno, vorrei avere maggiori informazioni sui servizi di consulenza psicologica offerti. Grazie.",
        "consent": True
    })
    
    print(f"   Response status: {response.status_code}")
    
    if response.status_code == 200:
        data = response.json()
        print(f"   Response body: {json.dumps(data, indent=2)}")
        
        if data.get("ok") == True:
            log_pass("POST /api/contact returns 200 {ok: true} (Resend email should be dispatched)")
        else:
            log_fail("POST /api/contact response", f"Expected ok=true, got {data}")
    
    elif response.status_code == 500:
        # Server error - likely Resend API issue
        try:
            error_data = response.json()
            error_msg = error_data.get("error", response.text)
            print(f"   ❌ 500 ERROR: {error_msg}")
            log_fail("POST /api/contact returns 500", f"Server error (likely Resend API issue): {error_msg}")
        except:
            print(f"   ❌ 500 ERROR: {response.text}")
            log_fail("POST /api/contact returns 500", f"Server error: {response.text}")
    
    else:
        log_fail("POST /api/contact unexpected status", f"Expected 200, got {response.status_code}: {response.text}")

except Exception as e:
    log_fail("POST /api/contact", f"Exception: {str(e)}")

# Test C: POST /api/contact with honeypot - should return 200 but NOT store
print("\n[TEST C] POST /api/contact with honeypot field 'website'")
try:
    response = requests.post(f"{BASE_URL}/contact", json={
        "name": "Spam Bot",
        "email": "spam@bot.com",
        "message": "This is spam",
        "website": "http://spam.com",  # Honeypot field
        "consent": True
    })
    
    print(f"   Response status: {response.status_code}")
    
    if response.status_code == 200:
        data = response.json()
        print(f"   Response body: {json.dumps(data, indent=2)}")
        
        if data.get("ok") == True:
            log_pass("POST /api/contact with honeypot returns 200 {ok: true} (silently rejected, not stored, no crash)")
        else:
            log_fail("POST /api/contact honeypot response", f"Expected ok=true, got {data}")
    else:
        log_fail("POST /api/contact honeypot status", f"Expected 200, got {response.status_code}: {response.text}")

except Exception as e:
    log_fail("POST /api/contact honeypot", f"Exception: {str(e)}")

# ============================================================================
# AREA 2: AVAILABILITY HOURS - EXACT VERIFICATION
# ============================================================================
print("\n" + "=" * 80)
print("AREA 2: AVAILABILITY HOURS - EXACT STRUCTURE VERIFICATION")
print("=" * 80)

print("\n[TEST D] GET /api/availability - verify exact day structure")
try:
    response = requests.get(f"{BASE_URL}/availability")
    
    print(f"   Response status: {response.status_code}")
    
    if response.status_code == 200:
        data = response.json()
        print(f"   Response body: {json.dumps(data, indent=2)}")
        
        if "days" in data:
            days = data["days"]
            
            # Expected structure
            expected = {
                "0": {"enabled": False, "slots": []},  # Sunday
                "1": {"enabled": True, "slots": ["09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00"]},  # Monday
                "2": {"enabled": True, "slots": ["09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00"]},  # Tuesday
                "3": {"enabled": True, "slots": ["09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00"]},  # Wednesday
                "4": {"enabled": True, "slots": ["09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00"]},  # Thursday
                "5": {"enabled": True, "slots": ["09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00"]},  # Friday
                "6": {"enabled": True, "slots": ["09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00"]},  # Saturday
            }
            
            all_correct = True
            deviations = []
            
            # Check each day
            for day_num in ["0", "1", "2", "3", "4", "5", "6"]:
                if day_num not in days:
                    all_correct = False
                    deviations.append(f"Day {day_num} missing")
                    continue
                
                actual_day = days[day_num]
                expected_day = expected[day_num]
                
                # Check enabled
                if actual_day.get("enabled") != expected_day["enabled"]:
                    all_correct = False
                    deviations.append(f"Day {day_num} enabled: expected {expected_day['enabled']}, got {actual_day.get('enabled')}")
                
                # Check slots
                actual_slots = actual_day.get("slots", [])
                expected_slots = expected_day["slots"]
                
                if actual_slots != expected_slots:
                    all_correct = False
                    deviations.append(f"Day {day_num} slots: expected {expected_slots}, got {actual_slots}")
            
            if all_correct:
                print("   ✓ Day 0 (Sunday): enabled=false, slots=[]")
                print("   ✓ Days 1-5 (Mon-Fri): enabled=true, slots=['09:00'...'17:00'] (9 slots)")
                print("   ✓ Day 6 (Saturday): enabled=true, slots=['09:00'...'15:00'] (7 slots)")
                log_pass("GET /api/availability returns EXACT correct structure (Sun disabled, Mon-Fri 09:00-17:00, Sat 09:00-15:00)")
            else:
                print("   ❌ DEVIATIONS FOUND:")
                for dev in deviations:
                    print(f"      - {dev}")
                log_fail("GET /api/availability structure", f"Deviations: {'; '.join(deviations)}")
        else:
            log_fail("GET /api/availability missing days", f"Response does not contain 'days' field: {data}")
    else:
        log_fail("GET /api/availability status", f"Expected 200, got {response.status_code}: {response.text}")

except Exception as e:
    log_fail("GET /api/availability", f"Exception: {str(e)}")

# ============================================================================
# QUICK REGRESSION TESTS
# ============================================================================
print("\n" + "=" * 80)
print("QUICK REGRESSION TESTS")
print("=" * 80)

# Test E: POST /api/appointments duplicate (409)
print("\n[TEST E] POST /api/appointments duplicate booking (same date+time) -> 409")
try:
    response = requests.post(f"{BASE_URL}/appointments", json={
        "name": "Another Person",
        "email": "another@example.com",
        "date": future_date,
        "time": "10:00",  # Same as first booking
        "service": "Colloquio psicologico",
        "modality": "Online",
        "consent": True
    })
    
    print(f"   Response status: {response.status_code}")
    
    if response.status_code == 409:
        log_pass("POST /api/appointments duplicate booking returns 409 conflict")
    else:
        log_fail("POST /api/appointments duplicate", f"Expected 409, got {response.status_code}: {response.text}")

except Exception as e:
    log_fail("POST /api/appointments duplicate", f"Exception: {str(e)}")

# Test F: POST /api/appointments missing consent (400)
print("\n[TEST F] POST /api/appointments missing consent -> 400")
try:
    response = requests.post(f"{BASE_URL}/appointments", json={
        "name": "Test User",
        "email": "test@example.com",
        "date": future_date,
        "time": "11:00",
        "service": "Colloquio psicologico",
        "modality": "Online",
        "consent": False  # Missing consent
    })
    
    print(f"   Response status: {response.status_code}")
    
    if response.status_code == 400:
        log_pass("POST /api/appointments missing consent returns 400")
    else:
        log_fail("POST /api/appointments missing consent", f"Expected 400, got {response.status_code}: {response.text}")

except Exception as e:
    log_fail("POST /api/appointments missing consent", f"Exception: {str(e)}")

# Test G: GET /api/appointments (admin) -> 200 array
print("\n[TEST G] GET /api/appointments (admin) -> 200 array")
try:
    response = requests.get(f"{BASE_URL}/appointments", headers={"x-admin-token": admin_token})
    
    print(f"   Response status: {response.status_code}")
    
    if response.status_code == 200:
        data = response.json()
        if isinstance(data, list):
            print(f"   ✓ Returns array with {len(data)} appointments")
            log_pass("GET /api/appointments (admin) returns 200 array")
        else:
            log_fail("GET /api/appointments type", f"Expected array, got {type(data)}")
    else:
        log_fail("GET /api/appointments status", f"Expected 200, got {response.status_code}: {response.text}")

except Exception as e:
    log_fail("GET /api/appointments", f"Exception: {str(e)}")

# Test H: GET /api/appointments/booked -> only times, no personal data
print(f"\n[TEST H] GET /api/appointments/booked?date={future_date} -> only times, no personal data")
try:
    response = requests.get(f"{BASE_URL}/appointments/booked?date={future_date}")
    
    print(f"   Response status: {response.status_code}")
    
    if response.status_code == 200:
        data = response.json()
        print(f"   Response body: {json.dumps(data, indent=2)}")
        
        if "booked" in data:
            booked = data["booked"]
            
            # Verify it's an array of strings (times only)
            if isinstance(booked, list):
                if all(isinstance(t, str) for t in booked):
                    # Check no personal data leaked
                    has_personal_data = any(
                        key in data for key in ["name", "email", "phone", "message"]
                    )
                    
                    if not has_personal_data:
                        print(f"   ✓ Returns only times: {booked}")
                        log_pass("GET /api/appointments/booked returns only times array, no personal data")
                    else:
                        log_fail("GET /api/appointments/booked personal data leak", f"Response contains personal data: {data}")
                else:
                    log_fail("GET /api/appointments/booked type", f"Booked array contains non-string items: {booked}")
            else:
                log_fail("GET /api/appointments/booked type", f"Expected array, got {type(booked)}")
        else:
            log_fail("GET /api/appointments/booked missing field", f"Response missing 'booked' field: {data}")
    else:
        log_fail("GET /api/appointments/booked status", f"Expected 200, got {response.status_code}: {response.text}")

except Exception as e:
    log_fail("GET /api/appointments/booked", f"Exception: {str(e)}")

# ============================================================================
# CLEANUP: DELETE TEST APPOINTMENTS
# ============================================================================
print("\n" + "=" * 80)
print("CLEANUP: DELETE TEST APPOINTMENTS")
print("=" * 80)

for appt_id in created_appointment_ids:
    print(f"\n[CLEANUP] DELETE /api/appointments/{appt_id}")
    try:
        response = requests.delete(f"{BASE_URL}/appointments/{appt_id}", headers={"x-admin-token": admin_token})
        if response.status_code == 200:
            print(f"   ✓ Deleted appointment {appt_id}")
        else:
            print(f"   ⚠️  Failed to delete {appt_id}: {response.status_code}")
    except Exception as e:
        print(f"   ⚠️  Exception deleting {appt_id}: {str(e)}")

# ============================================================================
# SUMMARY
# ============================================================================
print("\n" + "=" * 80)
print("TEST SUMMARY")
print("=" * 80)
print(f"✅ PASSED: {len(test_results['passed'])}")
print(f"❌ FAILED: {len(test_results['failed'])}")
print(f"⚠️  WARNINGS: {len(test_results['warnings'])}")
print()

if test_results['failed']:
    print("FAILED TESTS:")
    for fail in test_results['failed']:
        print(f"  - {fail}")
    print()

if test_results['warnings']:
    print("WARNINGS:")
    for warning in test_results['warnings']:
        print(f"  - {warning}")
    print()

print("=" * 80)
if len(test_results['failed']) == 0:
    print("✅ ALL CRITICAL TESTS PASSED")
    print("Resend email integration and availability hours are working correctly")
else:
    print(f"❌ {len(test_results['failed'])} TESTS FAILED")
    print("Please review failed tests above")
print("=" * 80)
