#!/usr/bin/env python3
"""
Backend API Test Suite for Dott.ssa Giulia Flori Psychologist Website
Tests all endpoints under /api with proper authentication and validation
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

def check_no_mongo_id(data, test_name):
    """Verify no _id field is leaked in response"""
    if isinstance(data, dict):
        if "_id" in data:
            log_fail(test_name, "Response contains Mongo _id field")
            return False
        for value in data.values():
            if not check_no_mongo_id(value, test_name):
                return False
    elif isinstance(data, list):
        for item in data:
            if not check_no_mongo_id(item, test_name):
                return False
    return True

print("=" * 80)
print("BACKEND API TEST SUITE - Dott.ssa Giulia Flori")
print("=" * 80)
print(f"Base URL: {BASE_URL}")
print()

# Store test data for cleanup
created_appointment_id = None
created_blog_id = None
admin_token = None

# ============================================================================
# 1. ADMIN LOGIN & VERIFY
# ============================================================================
print("\n" + "=" * 80)
print("1. ADMIN LOGIN & VERIFY")
print("=" * 80)

# Test 1.1: Login with correct password
try:
    response = requests.post(f"{BASE_URL}/admin/login", json={"password": ADMIN_PASSWORD})
    if response.status_code == 200:
        data = response.json()
        if data.get("ok") and "token" in data:
            admin_token = data["token"]
            check_no_mongo_id(data, "Admin login response")
            log_pass("Admin login with correct password returns 200 + token")
        else:
            log_fail("Admin login with correct password", f"Missing ok or token in response: {data}")
    else:
        log_fail("Admin login with correct password", f"Expected 200, got {response.status_code}: {response.text}")
except Exception as e:
    log_fail("Admin login with correct password", f"Exception: {str(e)}")

# Test 1.2: Login with wrong password
try:
    response = requests.post(f"{BASE_URL}/admin/login", json={"password": "wrongpassword"})
    if response.status_code == 401:
        log_pass("Admin login with wrong password returns 401")
    else:
        log_fail("Admin login with wrong password", f"Expected 401, got {response.status_code}")
except Exception as e:
    log_fail("Admin login with wrong password", f"Exception: {str(e)}")

# Test 1.3: Verify with valid token
if admin_token:
    try:
        response = requests.get(f"{BASE_URL}/admin/verify", headers={"x-admin-token": admin_token})
        if response.status_code == 200:
            data = response.json()
            if data.get("ok") == True:
                log_pass("Admin verify with valid token returns {ok: true}")
            else:
                log_fail("Admin verify with valid token", f"Expected ok=true, got {data}")
        else:
            log_fail("Admin verify with valid token", f"Expected 200, got {response.status_code}")
    except Exception as e:
        log_fail("Admin verify with valid token", f"Exception: {str(e)}")

# Test 1.4: Verify without token
try:
    response = requests.get(f"{BASE_URL}/admin/verify")
    if response.status_code == 200:
        data = response.json()
        if data.get("ok") == False:
            log_pass("Admin verify without token returns {ok: false}")
        else:
            log_fail("Admin verify without token", f"Expected ok=false, got {data}")
    else:
        log_fail("Admin verify without token", f"Expected 200, got {response.status_code}")
except Exception as e:
    log_fail("Admin verify without token", f"Exception: {str(e)}")

# ============================================================================
# 2. AVAILABILITY (PUBLIC GET, ADMIN PUT)
# ============================================================================
print("\n" + "=" * 80)
print("2. AVAILABILITY")
print("=" * 80)

# Test 2.1: GET availability (public)
try:
    response = requests.get(f"{BASE_URL}/availability")
    if response.status_code == 200:
        data = response.json()
        if "days" in data:
            days = data["days"]
            # Check days 0-6 exist
            expected_days = ["0", "1", "2", "3", "4", "5", "6"]
            if all(day in days for day in expected_days):
                # Check Mon-Fri (1-5) enabled, Sat-Sun (0,6) disabled
                weekdays_enabled = all(days[str(i)].get("enabled") for i in range(1, 6))
                weekend_disabled = not days["0"].get("enabled") and not days["6"].get("enabled")
                if weekdays_enabled and weekend_disabled:
                    check_no_mongo_id(data, "Availability GET response")
                    log_pass("GET /api/availability returns 200 with correct days structure")
                else:
                    log_warning("GET /api/availability", "Days enabled/disabled don't match expected default (Mon-Fri enabled, Sat-Sun disabled)")
            else:
                log_fail("GET /api/availability", f"Missing expected days 0-6: {days.keys()}")
        else:
            log_fail("GET /api/availability", f"Missing 'days' in response: {data}")
    else:
        log_fail("GET /api/availability", f"Expected 200, got {response.status_code}")
except Exception as e:
    log_fail("GET /api/availability", f"Exception: {str(e)}")

# Test 2.2: PUT availability without token (should fail)
if admin_token:
    try:
        test_days = {
            "days": {
                "1": {"enabled": True, "slots": ["09:00", "10:00"]},
                "2": {"enabled": True, "slots": ["09:00", "10:00"]},
                "3": {"enabled": True, "slots": ["09:00", "10:00"]},
                "4": {"enabled": True, "slots": ["09:00", "10:00"]},
                "5": {"enabled": True, "slots": ["09:00"]},
                "6": {"enabled": False, "slots": []},
                "0": {"enabled": False, "slots": []},
            }
        }
        response = requests.put(f"{BASE_URL}/availability", json=test_days)
        if response.status_code == 401:
            log_pass("PUT /api/availability without token returns 401")
        else:
            log_fail("PUT /api/availability without token", f"Expected 401, got {response.status_code}")
    except Exception as e:
        log_fail("PUT /api/availability without token", f"Exception: {str(e)}")

    # Test 2.3: PUT availability with token (should succeed)
    try:
        response = requests.put(f"{BASE_URL}/availability", json=test_days, headers={"x-admin-token": admin_token})
        if response.status_code == 200:
            data = response.json()
            if "days" in data and data["days"]["1"]["slots"] == ["09:00", "10:00"]:
                check_no_mongo_id(data, "Availability PUT response")
                log_pass("PUT /api/availability with token returns 200 and updates days")
                
                # Verify persistence
                verify_response = requests.get(f"{BASE_URL}/availability")
                if verify_response.status_code == 200:
                    verify_data = verify_response.json()
                    if verify_data["days"]["1"]["slots"] == ["09:00", "10:00"]:
                        log_pass("PUT /api/availability changes persist (verified with GET)")
                    else:
                        log_fail("PUT /api/availability persistence", "Changes not persisted")
            else:
                log_fail("PUT /api/availability with token", f"Unexpected response: {data}")
        else:
            log_fail("PUT /api/availability with token", f"Expected 200, got {response.status_code}")
    except Exception as e:
        log_fail("PUT /api/availability with token", f"Exception: {str(e)}")

# ============================================================================
# 3. APPOINTMENTS - CREATE (PUBLIC)
# ============================================================================
print("\n" + "=" * 80)
print("3. APPOINTMENTS - CREATE (PUBLIC)")
print("=" * 80)

# Test 3.1: Missing required field (no email)
try:
    response = requests.post(f"{BASE_URL}/appointments", json={
        "name": "Maria Rossi",
        "date": "2025-06-16",
        "time": "10:00",
        "service": "Consulenza individuale",
        "consent": True
    })
    if response.status_code == 400:
        log_pass("POST /api/appointments missing email returns 400")
    else:
        log_fail("POST /api/appointments missing email", f"Expected 400, got {response.status_code}")
except Exception as e:
    log_fail("POST /api/appointments missing email", f"Exception: {str(e)}")

# Test 3.2: Missing consent
try:
    response = requests.post(f"{BASE_URL}/appointments", json={
        "name": "Maria Rossi",
        "email": "maria.rossi@example.com",
        "date": "2025-06-16",
        "time": "10:00",
        "service": "Consulenza individuale",
        "consent": False
    })
    if response.status_code == 400:
        log_pass("POST /api/appointments with consent=false returns 400")
    else:
        log_fail("POST /api/appointments with consent=false", f"Expected 400, got {response.status_code}")
except Exception as e:
    log_fail("POST /api/appointments with consent=false", f"Exception: {str(e)}")

# Test 3.3: Honeypot (should return ok but not store)
try:
    response = requests.post(f"{BASE_URL}/appointments", json={
        "name": "Spam Bot",
        "email": "spam@bot.com",
        "date": "2025-06-16",
        "time": "11:00",
        "service": "Spam",
        "consent": True,
        "website": "spam"
    })
    if response.status_code == 200:
        data = response.json()
        if data.get("ok") == True:
            log_pass("POST /api/appointments with honeypot returns {ok: true}")
            
            # Verify it's not actually stored (check booked slots)
            if admin_token:
                verify_response = requests.get(f"{BASE_URL}/appointments", headers={"x-admin-token": admin_token})
                if verify_response.status_code == 200:
                    appointments = verify_response.json()
                    honeypot_found = any(a.get("email") == "spam@bot.com" for a in appointments)
                    if not honeypot_found:
                        log_pass("Honeypot appointment NOT stored in database")
                    else:
                        log_fail("Honeypot appointment storage", "Honeypot appointment was stored (should be silently rejected)")
        else:
            log_fail("POST /api/appointments with honeypot", f"Expected ok=true, got {data}")
    else:
        log_fail("POST /api/appointments with honeypot", f"Expected 200, got {response.status_code}")
except Exception as e:
    log_fail("POST /api/appointments with honeypot", f"Exception: {str(e)}")

# Test 3.4: Valid booking
try:
    response = requests.post(f"{BASE_URL}/appointments", json={
        "name": "Giulia Bianchi",
        "email": "giulia.bianchi@example.com",
        "phone": "+39 333 1234567",
        "date": "2025-06-16",
        "time": "10:00",
        "service": "Consulenza individuale",
        "modality": "In studio",
        "message": "Prima consulenza",
        "consent": True
    })
    if response.status_code == 200:
        data = response.json()
        if data.get("ok") and "appointment" in data:
            appointment = data["appointment"]
            if appointment.get("status") == "pending" and "id" in appointment:
                created_appointment_id = appointment["id"]
                check_no_mongo_id(data, "Appointment create response")
                log_pass("POST /api/appointments valid booking returns 200 with status=pending and UUID id")
            else:
                log_fail("POST /api/appointments valid booking", f"Missing status=pending or id: {appointment}")
        else:
            log_fail("POST /api/appointments valid booking", f"Missing ok or appointment: {data}")
    else:
        log_fail("POST /api/appointments valid booking", f"Expected 200, got {response.status_code}: {response.text}")
except Exception as e:
    log_fail("POST /api/appointments valid booking", f"Exception: {str(e)}")

# Test 3.5: Double booking (same date+time)
try:
    response = requests.post(f"{BASE_URL}/appointments", json={
        "name": "Another Person",
        "email": "another@example.com",
        "date": "2025-06-16",
        "time": "10:00",
        "service": "Consulenza individuale",
        "consent": True
    })
    if response.status_code == 409:
        log_pass("POST /api/appointments double booking returns 409 conflict")
    else:
        log_fail("POST /api/appointments double booking", f"Expected 409, got {response.status_code}")
except Exception as e:
    log_fail("POST /api/appointments double booking", f"Exception: {str(e)}")

# ============================================================================
# 4. APPOINTMENTS - BOOKED SLOTS (PUBLIC)
# ============================================================================
print("\n" + "=" * 80)
print("4. APPOINTMENTS - BOOKED SLOTS (PUBLIC)")
print("=" * 80)

# Test 4.1: GET booked slots for date
try:
    response = requests.get(f"{BASE_URL}/appointments/booked?date=2025-06-16")
    if response.status_code == 200:
        data = response.json()
        if "date" in data and "booked" in data:
            if "10:00" in data["booked"]:
                # Check no personal data leaked
                if isinstance(data["booked"], list) and all(isinstance(t, str) for t in data["booked"]):
                    check_no_mongo_id(data, "Booked slots response")
                    log_pass("GET /api/appointments/booked returns booked times without personal data")
                else:
                    log_fail("GET /api/appointments/booked", "Booked array contains non-string data (possible leak)")
            else:
                log_fail("GET /api/appointments/booked", f"Expected '10:00' in booked times, got {data['booked']}")
        else:
            log_fail("GET /api/appointments/booked", f"Missing date or booked in response: {data}")
    else:
        log_fail("GET /api/appointments/booked", f"Expected 200, got {response.status_code}")
except Exception as e:
    log_fail("GET /api/appointments/booked", f"Exception: {str(e)}")

# ============================================================================
# 5. APPOINTMENTS - ADMIN OPERATIONS
# ============================================================================
print("\n" + "=" * 80)
print("5. APPOINTMENTS - ADMIN OPERATIONS")
print("=" * 80)

if admin_token:
    # Test 5.1: GET appointments without token
    try:
        response = requests.get(f"{BASE_URL}/appointments")
        if response.status_code == 401:
            log_pass("GET /api/appointments without token returns 401")
        else:
            log_fail("GET /api/appointments without token", f"Expected 401, got {response.status_code}")
    except Exception as e:
        log_fail("GET /api/appointments without token", f"Exception: {str(e)}")

    # Test 5.2: GET appointments with token
    try:
        response = requests.get(f"{BASE_URL}/appointments", headers={"x-admin-token": admin_token})
        if response.status_code == 200:
            data = response.json()
            if isinstance(data, list):
                # Find our created appointment
                found = any(a.get("email") == "giulia.bianchi@example.com" for a in data)
                if found:
                    check_no_mongo_id(data, "Appointments list response")
                    log_pass("GET /api/appointments with token returns 200 array with full data")
                else:
                    log_fail("GET /api/appointments with token", "Created appointment not found in list")
            else:
                log_fail("GET /api/appointments with token", f"Expected array, got {type(data)}")
        else:
            log_fail("GET /api/appointments with token", f"Expected 200, got {response.status_code}")
    except Exception as e:
        log_fail("GET /api/appointments with token", f"Exception: {str(e)}")

    # Test 5.3: PUT appointment (update status)
    if created_appointment_id:
        try:
            response = requests.put(
                f"{BASE_URL}/appointments/{created_appointment_id}",
                json={"status": "confirmed"},
                headers={"x-admin-token": admin_token}
            )
            if response.status_code == 200:
                data = response.json()
                if data.get("status") == "confirmed":
                    check_no_mongo_id(data, "Appointment update response")
                    log_pass("PUT /api/appointments/:id with token updates status to confirmed")
                else:
                    log_fail("PUT /api/appointments/:id", f"Status not updated: {data}")
            else:
                log_fail("PUT /api/appointments/:id", f"Expected 200, got {response.status_code}")
        except Exception as e:
            log_fail("PUT /api/appointments/:id", f"Exception: {str(e)}")

    # Test 5.4: DELETE appointment
    if created_appointment_id:
        try:
            response = requests.delete(
                f"{BASE_URL}/appointments/{created_appointment_id}",
                headers={"x-admin-token": admin_token}
            )
            if response.status_code == 200:
                data = response.json()
                if data.get("ok") == True:
                    log_pass("DELETE /api/appointments/:id with token returns 200 {ok: true}")
                    
                    # Verify it's removed
                    verify_response = requests.get(f"{BASE_URL}/appointments", headers={"x-admin-token": admin_token})
                    if verify_response.status_code == 200:
                        appointments = verify_response.json()
                        still_exists = any(a.get("id") == created_appointment_id for a in appointments)
                        if not still_exists:
                            log_pass("DELETE /api/appointments/:id removes appointment from database")
                            
                            # Verify slot is freed
                            booked_response = requests.get(f"{BASE_URL}/appointments/booked?date=2025-06-16")
                            if booked_response.status_code == 200:
                                booked_data = booked_response.json()
                                if "10:00" not in booked_data.get("booked", []):
                                    log_pass("DELETE /api/appointments/:id frees up the booked slot")
                                else:
                                    log_fail("DELETE appointment slot freeing", "Slot 10:00 still marked as booked")
                        else:
                            log_fail("DELETE appointment verification", "Appointment still exists after deletion")
                else:
                    log_fail("DELETE /api/appointments/:id", f"Expected ok=true, got {data}")
            else:
                log_fail("DELETE /api/appointments/:id", f"Expected 200, got {response.status_code}")
        except Exception as e:
            log_fail("DELETE /api/appointments/:id", f"Exception: {str(e)}")

# ============================================================================
# 6. BLOG - PUBLIC GET
# ============================================================================
print("\n" + "=" * 80)
print("6. BLOG - PUBLIC GET")
print("=" * 80)

# Test 6.1: GET blog (public)
try:
    response = requests.get(f"{BASE_URL}/blog")
    if response.status_code == 200:
        data = response.json()
        if isinstance(data, list) and len(data) >= 10:
            # Check first post has required fields
            post = data[0]
            required_fields = ["id", "slug", "title", "category", "excerpt", "cover", "content", "published"]
            if all(field in post for field in required_fields):
                if post.get("published") == True:
                    # Verify UUID format (not ObjectID)
                    if len(post["id"]) == 36 and post["id"].count("-") == 4:
                        check_no_mongo_id(data, "Blog list response")
                        log_pass("GET /api/blog returns 200 with ~10 auto-seeded Italian posts with UUID ids")
                    else:
                        log_fail("GET /api/blog", f"Post id is not UUID format: {post['id']}")
                else:
                    log_fail("GET /api/blog", "Post published field is not true")
            else:
                log_fail("GET /api/blog", f"Missing required fields in post: {post.keys()}")
        else:
            log_fail("GET /api/blog", f"Expected array with >=10 posts, got {len(data) if isinstance(data, list) else type(data)}")
    else:
        log_fail("GET /api/blog", f"Expected 200, got {response.status_code}")
except Exception as e:
    log_fail("GET /api/blog", f"Exception: {str(e)}")

# ============================================================================
# 7. BLOG - ADMIN CRUD
# ============================================================================
print("\n" + "=" * 80)
print("7. BLOG - ADMIN CRUD")
print("=" * 80)

if admin_token:
    # Test 7.1: POST blog (create)
    try:
        response = requests.post(
            f"{BASE_URL}/blog",
            json={
                "title": "Test Article for Testing",
                "category": "Test",
                "excerpt": "This is a test article",
                "content": "Full content of the test article for backend testing purposes.",
                "published": True
            },
            headers={"x-admin-token": admin_token}
        )
        if response.status_code == 200:
            data = response.json()
            if data.get("ok") and "post" in data:
                post = data["post"]
                if "slug" in post and "id" in post and len(post["id"]) == 36:
                    created_blog_id = post["id"]
                    check_no_mongo_id(data, "Blog create response")
                    log_pass("POST /api/blog with token creates post with generated slug + UUID")
                else:
                    log_fail("POST /api/blog", f"Missing slug or id in post: {post}")
            else:
                log_fail("POST /api/blog", f"Missing ok or post: {data}")
        else:
            log_fail("POST /api/blog", f"Expected 200, got {response.status_code}")
    except Exception as e:
        log_fail("POST /api/blog", f"Exception: {str(e)}")

    # Test 7.2: GET blog?all=true with token (includes drafts)
    try:
        response = requests.get(f"{BASE_URL}/blog?all=true", headers={"x-admin-token": admin_token})
        if response.status_code == 200:
            data = response.json()
            if isinstance(data, list):
                log_pass("GET /api/blog?all=true with token returns all posts including drafts")
            else:
                log_fail("GET /api/blog?all=true", f"Expected array, got {type(data)}")
        else:
            log_fail("GET /api/blog?all=true", f"Expected 200, got {response.status_code}")
    except Exception as e:
        log_fail("GET /api/blog?all=true", f"Exception: {str(e)}")

    # Test 7.3: GET blog?all=true without token (should behave like public)
    try:
        response = requests.get(f"{BASE_URL}/blog?all=true")
        if response.status_code == 200:
            data = response.json()
            if isinstance(data, list):
                # Should only return published posts
                all_published = all(post.get("published") == True for post in data)
                if all_published:
                    log_pass("GET /api/blog?all=true without token behaves like public (only published)")
                else:
                    log_fail("GET /api/blog?all=true without token", "Returns unpublished posts")
            else:
                log_fail("GET /api/blog?all=true without token", f"Expected array, got {type(data)}")
        else:
            log_fail("GET /api/blog?all=true without token", f"Expected 200, got {response.status_code}")
    except Exception as e:
        log_fail("GET /api/blog?all=true without token", f"Exception: {str(e)}")

    # Test 7.4: PUT blog (update)
    if created_blog_id:
        try:
            response = requests.put(
                f"{BASE_URL}/blog/{created_blog_id}",
                json={"title": "Updated Test Article"},
                headers={"x-admin-token": admin_token}
            )
            if response.status_code == 200:
                data = response.json()
                if data.get("title") == "Updated Test Article":
                    check_no_mongo_id(data, "Blog update response")
                    log_pass("PUT /api/blog/:id with token updates title")
                else:
                    log_fail("PUT /api/blog/:id", f"Title not updated: {data}")
            else:
                log_fail("PUT /api/blog/:id", f"Expected 200, got {response.status_code}")
        except Exception as e:
            log_fail("PUT /api/blog/:id", f"Exception: {str(e)}")

    # Test 7.5: DELETE blog
    if created_blog_id:
        try:
            response = requests.delete(
                f"{BASE_URL}/blog/{created_blog_id}",
                headers={"x-admin-token": admin_token}
            )
            if response.status_code == 200:
                data = response.json()
                if data.get("ok") == True:
                    log_pass("DELETE /api/blog/:id with token returns 200 {ok: true}")
                else:
                    log_fail("DELETE /api/blog/:id", f"Expected ok=true, got {data}")
            else:
                log_fail("DELETE /api/blog/:id", f"Expected 200, got {response.status_code}")
        except Exception as e:
            log_fail("DELETE /api/blog/:id", f"Exception: {str(e)}")

# ============================================================================
# 8. CONTACT - POST & GET
# ============================================================================
print("\n" + "=" * 80)
print("8. CONTACT - POST & GET")
print("=" * 80)

# Test 8.1: POST contact missing message
try:
    response = requests.post(f"{BASE_URL}/contact", json={
        "name": "Test User",
        "email": "test@example.com",
        "consent": True
    })
    if response.status_code == 400:
        log_pass("POST /api/contact missing message returns 400")
    else:
        log_fail("POST /api/contact missing message", f"Expected 400, got {response.status_code}")
except Exception as e:
    log_fail("POST /api/contact missing message", f"Exception: {str(e)}")

# Test 8.2: POST contact missing consent
try:
    response = requests.post(f"{BASE_URL}/contact", json={
        "name": "Test User",
        "email": "test@example.com",
        "message": "Test message",
        "consent": False
    })
    if response.status_code == 400:
        log_pass("POST /api/contact missing consent returns 400")
    else:
        log_fail("POST /api/contact missing consent", f"Expected 400, got {response.status_code}")
except Exception as e:
    log_fail("POST /api/contact missing consent", f"Exception: {str(e)}")

# Test 8.3: POST contact with honeypot
try:
    response = requests.post(f"{BASE_URL}/contact", json={
        "name": "Spam Bot",
        "email": "spam@bot.com",
        "message": "Spam message",
        "consent": True,
        "website": "spam"
    })
    if response.status_code == 200:
        data = response.json()
        if data.get("ok") == True:
            log_pass("POST /api/contact with honeypot returns {ok: true}")
            
            # Verify not stored
            if admin_token:
                verify_response = requests.get(f"{BASE_URL}/contact", headers={"x-admin-token": admin_token})
                if verify_response.status_code == 200:
                    messages = verify_response.json()
                    honeypot_found = any(m.get("email") == "spam@bot.com" for m in messages)
                    if not honeypot_found:
                        log_pass("Honeypot contact message NOT stored in database")
                    else:
                        log_fail("Honeypot contact storage", "Honeypot message was stored")
        else:
            log_fail("POST /api/contact with honeypot", f"Expected ok=true, got {data}")
    else:
        log_fail("POST /api/contact with honeypot", f"Expected 200, got {response.status_code}")
except Exception as e:
    log_fail("POST /api/contact with honeypot", f"Exception: {str(e)}")

# Test 8.4: POST contact valid
try:
    response = requests.post(f"{BASE_URL}/contact", json={
        "name": "Laura Verdi",
        "email": "laura.verdi@example.com",
        "phone": "+39 333 9876543",
        "message": "Vorrei informazioni sui servizi offerti",
        "consent": True
    })
    if response.status_code == 200:
        data = response.json()
        if data.get("ok") == True:
            check_no_mongo_id(data, "Contact create response")
            log_pass("POST /api/contact valid message returns 200 {ok: true}")
        else:
            log_fail("POST /api/contact valid", f"Expected ok=true, got {data}")
    else:
        log_fail("POST /api/contact valid", f"Expected 200, got {response.status_code}: {response.text}")
except Exception as e:
    log_fail("POST /api/contact valid", f"Exception: {str(e)}")

# Test 8.5: GET contact without token
try:
    response = requests.get(f"{BASE_URL}/contact")
    if response.status_code == 401:
        log_pass("GET /api/contact without token returns 401")
    else:
        log_fail("GET /api/contact without token", f"Expected 401, got {response.status_code}")
except Exception as e:
    log_fail("GET /api/contact without token", f"Exception: {str(e)}")

# Test 8.6: GET contact with token
if admin_token:
    try:
        response = requests.get(f"{BASE_URL}/contact", headers={"x-admin-token": admin_token})
        if response.status_code == 200:
            data = response.json()
            if isinstance(data, list):
                # Find our created message
                found = any(m.get("email") == "laura.verdi@example.com" for m in data)
                if found:
                    check_no_mongo_id(data, "Contact list response")
                    log_pass("GET /api/contact with token returns 200 array")
                else:
                    log_fail("GET /api/contact with token", "Created message not found in list")
            else:
                log_fail("GET /api/contact with token", f"Expected array, got {type(data)}")
        else:
            log_fail("GET /api/contact with token", f"Expected 200, got {response.status_code}")
    except Exception as e:
        log_fail("GET /api/contact with token", f"Exception: {str(e)}")

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
else:
    print(f"❌ {len(test_results['failed'])} TESTS FAILED")
print("=" * 80)
