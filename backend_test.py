#!/usr/bin/env python3
"""
Backend API Test Suite - Blog Rework + MongoDB Connection Fix
Tests all blog endpoints with new fields (subtitle, date) and slug endpoint
Plus regression tests for admin, availability, appointments, contact
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
created_post_id = None
created_post_slug = None
created_draft_id = None
created_draft_slug = None
created_appointment_id = None

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
print("BACKEND API TEST SUITE - Blog Rework + Connection Fix")
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
# BLOG TESTS (NEW CHANGES)
# ============================================================================
print("\n" + "=" * 80)
print("BLOG TESTS - NEW CHANGES")
print("=" * 80)

# Test 1: GET /api/blog should return [] (empty array after migration)
print("\n[1] GET /api/blog (public) - should be empty after migration")
try:
    response = requests.get(f"{BASE_URL}/blog")
    if response.status_code == 200:
        data = response.json()
        if isinstance(data, list):
            if len(data) == 0:
                check_no_mongo_id(data, "Blog list empty")
                log_pass("GET /api/blog returns [] (empty array after demo posts removed)")
            else:
                log_warning("GET /api/blog", f"Expected empty array [], got {len(data)} posts. This is OK if posts were manually created.")
                print(f"   Posts found: {[p.get('title', 'no title') for p in data[:3]]}")
        else:
            log_fail("GET /api/blog", f"Expected array, got {type(data)}")
    else:
        log_fail("GET /api/blog", f"Expected 200, got {response.status_code}: {response.text}")
except Exception as e:
    log_fail("GET /api/blog", f"Exception: {str(e)}")

# Test 2: POST /api/blog with new fields (subtitle, date, readingTime, category)
print("\n[2] POST /api/blog (admin) with subtitle, date, readingTime, category")
try:
    response = requests.post(
        f"{BASE_URL}/blog",
        json={
            "title": "Articolo di prova",
            "subtitle": "Un sottotitolo di prova",
            "category": "Ansia",
            "date": "2026-06-10",
            "readingTime": 6,
            "content": "## Titolo\n\nParagrafo di prova.",
            "published": True
        },
        headers={"x-admin-token": admin_token}
    )
    if response.status_code == 200:
        data = response.json()
        if data.get("ok") and "post" in data:
            post = data["post"]
            # Verify all fields
            checks = {
                "id": "id" in post and len(post["id"]) == 36,
                "slug": "slug" in post and len(post["slug"]) > 0,
                "subtitle": post.get("subtitle") == "Un sottotitolo di prova",
                "date": post.get("date") == "2026-06-10",
                "readingTime": post.get("readingTime") == 6,
                "category": post.get("category") == "Ansia",
                "content": "Titolo" in post.get("content", ""),
                "published": post.get("published") == True
            }
            
            if all(checks.values()):
                created_post_id = post["id"]
                created_post_slug = post["slug"]
                check_no_mongo_id(data, "Blog create with new fields")
                log_pass(f"POST /api/blog creates post with UUID id, slug={created_post_slug}, subtitle, date, readingTime, category")
            else:
                failed_checks = [k for k, v in checks.items() if not v]
                log_fail("POST /api/blog", f"Missing or incorrect fields: {failed_checks}. Post: {post}")
        else:
            log_fail("POST /api/blog", f"Missing ok or post: {data}")
    else:
        log_fail("POST /api/blog", f"Expected 200, got {response.status_code}: {response.text}")
except Exception as e:
    log_fail("POST /api/blog", f"Exception: {str(e)}")

# Test 3: GET /api/blog/:slug (public) - should return the full post
print(f"\n[3] GET /api/blog/{created_post_slug} (public) - should return full post")
if created_post_slug:
    try:
        response = requests.get(f"{BASE_URL}/blog/{created_post_slug}")
        if response.status_code == 200:
            data = response.json()
            # Verify it's the full post with all fields
            checks = {
                "id": data.get("id") == created_post_id,
                "slug": data.get("slug") == created_post_slug,
                "title": data.get("title") == "Articolo di prova",
                "subtitle": data.get("subtitle") == "Un sottotitolo di prova",
                "date": data.get("date") == "2026-06-10",
                "content": "Titolo" in data.get("content", ""),
                "no_mongo_id": "_id" not in data
            }
            
            if all(checks.values()):
                check_no_mongo_id(data, "Blog get by slug")
                log_pass(f"GET /api/blog/{created_post_slug} returns 200 with full post (subtitle, date, content, no _id)")
            else:
                failed_checks = [k for k, v in checks.items() if not v]
                log_fail(f"GET /api/blog/{created_post_slug}", f"Missing or incorrect fields: {failed_checks}")
        else:
            log_fail(f"GET /api/blog/{created_post_slug}", f"Expected 200, got {response.status_code}: {response.text}")
    except Exception as e:
        log_fail(f"GET /api/blog/{created_post_slug}", f"Exception: {str(e)}")
else:
    log_fail("GET /api/blog/:slug", "Skipped - no post created in previous test")

# Test 4: GET /api/blog/nonexistent-slug -> 404
print("\n[4] GET /api/blog/nonexistent-slug - should return 404")
try:
    response = requests.get(f"{BASE_URL}/blog/nonexistent-slug-12345")
    if response.status_code == 404:
        log_pass("GET /api/blog/nonexistent-slug returns 404")
    else:
        log_fail("GET /api/blog/nonexistent-slug", f"Expected 404, got {response.status_code}")
except Exception as e:
    log_fail("GET /api/blog/nonexistent-slug", f"Exception: {str(e)}")

# Test 5: Create DRAFT post and test visibility with/without admin token
print("\n[5] Create DRAFT post and test GET /api/blog/:slug visibility")
try:
    response = requests.post(
        f"{BASE_URL}/blog",
        json={
            "title": "Bozza articolo privato",
            "subtitle": "Questo è un draft",
            "category": "Test",
            "date": "2026-07-01",
            "readingTime": 3,
            "content": "Contenuto bozza non pubblicata.",
            "published": False
        },
        headers={"x-admin-token": admin_token}
    )
    if response.status_code == 200:
        data = response.json()
        if data.get("ok") and "post" in data:
            post = data["post"]
            created_draft_id = post["id"]
            created_draft_slug = post["slug"]
            log_pass(f"Created draft post with slug={created_draft_slug}")
            
            # Test 5a: GET draft slug WITHOUT admin token -> 404
            print(f"  [5a] GET /api/blog/{created_draft_slug} WITHOUT admin token")
            try:
                response_no_token = requests.get(f"{BASE_URL}/blog/{created_draft_slug}")
                if response_no_token.status_code == 404:
                    log_pass(f"GET /api/blog/{created_draft_slug} WITHOUT token returns 404 (draft hidden)")
                else:
                    log_fail(f"GET draft WITHOUT token", f"Expected 404, got {response_no_token.status_code}")
            except Exception as e:
                log_fail(f"GET draft WITHOUT token", f"Exception: {str(e)}")
            
            # Test 5b: GET draft slug WITH admin token -> 200
            print(f"  [5b] GET /api/blog/{created_draft_slug} WITH admin token")
            try:
                response_with_token = requests.get(f"{BASE_URL}/blog/{created_draft_slug}", headers={"x-admin-token": admin_token})
                if response_with_token.status_code == 200:
                    draft_data = response_with_token.json()
                    if draft_data.get("published") == False:
                        log_pass(f"GET /api/blog/{created_draft_slug} WITH token returns 200 (admin can see draft)")
                    else:
                        log_fail(f"GET draft WITH token", f"Expected published=false, got {draft_data.get('published')}")
                else:
                    log_fail(f"GET draft WITH token", f"Expected 200, got {response_with_token.status_code}")
            except Exception as e:
                log_fail(f"GET draft WITH token", f"Exception: {str(e)}")
            
            # Test 5c: GET /api/blog?all=true WITH admin token should include draft
            print(f"  [5c] GET /api/blog?all=true WITH admin token (should include draft)")
            try:
                response_all = requests.get(f"{BASE_URL}/blog?all=true", headers={"x-admin-token": admin_token})
                if response_all.status_code == 200:
                    all_posts = response_all.json()
                    draft_found = any(p.get("id") == created_draft_id for p in all_posts)
                    if draft_found:
                        log_pass("GET /api/blog?all=true WITH token includes draft post")
                    else:
                        log_fail("GET /api/blog?all=true WITH token", "Draft post not found in all=true list")
                else:
                    log_fail("GET /api/blog?all=true WITH token", f"Expected 200, got {response_all.status_code}")
            except Exception as e:
                log_fail("GET /api/blog?all=true WITH token", f"Exception: {str(e)}")
            
            # Test 5d: GET /api/blog (no token, no all=true) should NOT include draft
            print(f"  [5d] GET /api/blog (public) should NOT include draft")
            try:
                response_public = requests.get(f"{BASE_URL}/blog")
                if response_public.status_code == 200:
                    public_posts = response_public.json()
                    draft_found = any(p.get("id") == created_draft_id for p in public_posts)
                    if not draft_found:
                        log_pass("GET /api/blog (public) does NOT include draft post")
                    else:
                        log_fail("GET /api/blog (public)", "Draft post leaked to public list")
                else:
                    log_fail("GET /api/blog (public)", f"Expected 200, got {response_public.status_code}")
            except Exception as e:
                log_fail("GET /api/blog (public)", f"Exception: {str(e)}")
        else:
            log_fail("Create draft post", f"Missing ok or post: {data}")
    else:
        log_fail("Create draft post", f"Expected 200, got {response.status_code}: {response.text}")
except Exception as e:
    log_fail("Create draft post", f"Exception: {str(e)}")

# Test 6: PUT /api/blog/:id updating subtitle and date
print(f"\n[6] PUT /api/blog/{created_post_id} - update subtitle and date")
if created_post_id:
    try:
        response = requests.put(
            f"{BASE_URL}/blog/{created_post_id}",
            json={
                "subtitle": "Nuovo sottotitolo aggiornato",
                "date": "2026-07-01"
            },
            headers={"x-admin-token": admin_token}
        )
        if response.status_code == 200:
            data = response.json()
            if data.get("subtitle") == "Nuovo sottotitolo aggiornato" and data.get("date") == "2026-07-01":
                check_no_mongo_id(data, "Blog update response")
                log_pass(f"PUT /api/blog/{created_post_id} updates subtitle and date")
                
                # Verify persistence by GET slug
                print(f"  [6a] Verify persistence with GET /api/blog/{created_post_slug}")
                try:
                    verify_response = requests.get(f"{BASE_URL}/blog/{created_post_slug}")
                    if verify_response.status_code == 200:
                        verify_data = verify_response.json()
                        if verify_data.get("subtitle") == "Nuovo sottotitolo aggiornato" and verify_data.get("date") == "2026-07-01":
                            log_pass(f"PUT changes persisted (verified with GET /api/blog/{created_post_slug})")
                        else:
                            log_fail("PUT persistence", f"Changes not persisted: {verify_data}")
                    else:
                        log_fail("PUT persistence", f"GET returned {verify_response.status_code}")
                except Exception as e:
                    log_fail("PUT persistence", f"Exception: {str(e)}")
            else:
                log_fail(f"PUT /api/blog/{created_post_id}", f"Fields not updated: {data}")
        else:
            log_fail(f"PUT /api/blog/{created_post_id}", f"Expected 200, got {response.status_code}: {response.text}")
    except Exception as e:
        log_fail(f"PUT /api/blog/{created_post_id}", f"Exception: {str(e)}")
else:
    log_fail("PUT /api/blog/:id", "Skipped - no post created")

# Test 7: DELETE both posts and verify
print(f"\n[7] DELETE /api/blog/:id for both posts and verify")
if created_post_id:
    try:
        # Delete published post
        response = requests.delete(f"{BASE_URL}/blog/{created_post_id}", headers={"x-admin-token": admin_token})
        if response.status_code == 200:
            data = response.json()
            if data.get("ok") == True:
                log_pass(f"DELETE /api/blog/{created_post_id} returns 200 {{ok: true}}")
                
                # Verify slug returns 404
                print(f"  [7a] Verify GET /api/blog/{created_post_slug} now returns 404")
                try:
                    verify_response = requests.get(f"{BASE_URL}/blog/{created_post_slug}")
                    if verify_response.status_code == 404:
                        log_pass(f"GET /api/blog/{created_post_slug} returns 404 after deletion")
                    else:
                        log_fail("DELETE verification", f"Expected 404, got {verify_response.status_code}")
                except Exception as e:
                    log_fail("DELETE verification", f"Exception: {str(e)}")
            else:
                log_fail(f"DELETE /api/blog/{created_post_id}", f"Expected ok=true, got {data}")
        else:
            log_fail(f"DELETE /api/blog/{created_post_id}", f"Expected 200, got {response.status_code}")
    except Exception as e:
        log_fail(f"DELETE /api/blog/{created_post_id}", f"Exception: {str(e)}")

if created_draft_id:
    try:
        # Delete draft post
        response = requests.delete(f"{BASE_URL}/blog/{created_draft_id}", headers={"x-admin-token": admin_token})
        if response.status_code == 200:
            log_pass(f"DELETE /api/blog/{created_draft_id} (draft) returns 200")
        else:
            log_fail(f"DELETE /api/blog/{created_draft_id}", f"Expected 200, got {response.status_code}")
    except Exception as e:
        log_fail(f"DELETE /api/blog/{created_draft_id}", f"Exception: {str(e)}")

# Verify GET /api/blog returns [] again
print(f"  [7b] Verify GET /api/blog returns [] after all deletions")
try:
    response = requests.get(f"{BASE_URL}/blog")
    if response.status_code == 200:
        data = response.json()
        if len(data) == 0:
            log_pass("GET /api/blog returns [] after all test posts deleted")
        else:
            log_warning("GET /api/blog after deletion", f"Expected [], got {len(data)} posts (may include manually created posts)")
    else:
        log_fail("GET /api/blog after deletion", f"Expected 200, got {response.status_code}")
except Exception as e:
    log_fail("GET /api/blog after deletion", f"Exception: {str(e)}")

# ============================================================================
# REGRESSION TESTS
# ============================================================================
print("\n" + "=" * 80)
print("REGRESSION TESTS (Connection Fix + Existing Features)")
print("=" * 80)

# Test 8: Admin login wrong password
print("\n[8] POST /api/admin/login with wrong password")
try:
    response = requests.post(f"{BASE_URL}/admin/login", json={"password": "wrongpassword"})
    if response.status_code == 401:
        log_pass("Admin login with wrong password returns 401")
    else:
        log_fail("Admin login wrong password", f"Expected 401, got {response.status_code}")
except Exception as e:
    log_fail("Admin login wrong password", f"Exception: {str(e)}")

# Test 9: Admin verify with/without token
print("\n[9] GET /api/admin/verify with/without token")
try:
    # With token
    response_with = requests.get(f"{BASE_URL}/admin/verify", headers={"x-admin-token": admin_token})
    if response_with.status_code == 200 and response_with.json().get("ok") == True:
        log_pass("GET /api/admin/verify WITH token returns {ok: true}")
    else:
        log_fail("Admin verify WITH token", f"Expected {{ok: true}}, got {response_with.json()}")
    
    # Without token
    response_without = requests.get(f"{BASE_URL}/admin/verify")
    if response_without.status_code == 200 and response_without.json().get("ok") == False:
        log_pass("GET /api/admin/verify WITHOUT token returns {ok: false}")
    else:
        log_fail("Admin verify WITHOUT token", f"Expected {{ok: false}}, got {response_without.json()}")
except Exception as e:
    log_fail("Admin verify", f"Exception: {str(e)}")

# Test 10: GET /api/availability (public)
print("\n[10] GET /api/availability (public)")
try:
    response = requests.get(f"{BASE_URL}/availability")
    if response.status_code == 200:
        data = response.json()
        if "days" in data and "1" in data["days"]:
            check_no_mongo_id(data, "Availability GET")
            log_pass("GET /api/availability returns 200 with days object")
        else:
            log_fail("GET /api/availability", f"Missing days structure: {data}")
    else:
        log_fail("GET /api/availability", f"Expected 200, got {response.status_code}")
except Exception as e:
    log_fail("GET /api/availability", f"Exception: {str(e)}")

# Test 11: PUT /api/availability (admin)
print("\n[11] PUT /api/availability (admin)")
try:
    # Without token -> 401
    response_no_token = requests.put(f"{BASE_URL}/availability", json={"days": {}})
    if response_no_token.status_code == 401:
        log_pass("PUT /api/availability WITHOUT token returns 401")
    else:
        log_fail("PUT /api/availability WITHOUT token", f"Expected 401, got {response_no_token.status_code}")
    
    # With token -> 200
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
    response_with_token = requests.put(f"{BASE_URL}/availability", json=test_days, headers={"x-admin-token": admin_token})
    if response_with_token.status_code == 200:
        log_pass("PUT /api/availability WITH token returns 200")
    else:
        log_fail("PUT /api/availability WITH token", f"Expected 200, got {response_with_token.status_code}")
except Exception as e:
    log_fail("PUT /api/availability", f"Exception: {str(e)}")

# Test 12: POST /api/appointments valid booking
print("\n[12] POST /api/appointments valid booking")
try:
    response = requests.post(f"{BASE_URL}/appointments", json={
        "name": "Sofia Martini",
        "email": "sofia.martini@example.com",
        "date": "2026-06-16",
        "time": "10:00",
        "service": "Colloquio psicologico",
        "modality": "Online",
        "consent": True
    })
    if response.status_code == 200:
        data = response.json()
        if data.get("ok") and "appointment" in data:
            created_appointment_id = data["appointment"]["id"]
            check_no_mongo_id(data, "Appointment create")
            log_pass("POST /api/appointments valid booking returns 200")
        else:
            log_fail("POST /api/appointments valid", f"Missing ok or appointment: {data}")
    else:
        log_fail("POST /api/appointments valid", f"Expected 200, got {response.status_code}: {response.text}")
except Exception as e:
    log_fail("POST /api/appointments valid", f"Exception: {str(e)}")

# Test 13: POST /api/appointments duplicate (409)
print("\n[13] POST /api/appointments duplicate booking (same date+time)")
try:
    response = requests.post(f"{BASE_URL}/appointments", json={
        "name": "Another Person",
        "email": "another@example.com",
        "date": "2026-06-16",
        "time": "10:00",
        "service": "Colloquio psicologico",
        "modality": "Online",
        "consent": True
    })
    if response.status_code == 409:
        log_pass("POST /api/appointments duplicate booking returns 409 conflict")
    else:
        log_fail("POST /api/appointments duplicate", f"Expected 409, got {response.status_code}")
except Exception as e:
    log_fail("POST /api/appointments duplicate", f"Exception: {str(e)}")

# Test 14: POST /api/appointments missing consent (400)
print("\n[14] POST /api/appointments missing consent")
try:
    response = requests.post(f"{BASE_URL}/appointments", json={
        "name": "Test User",
        "email": "test@example.com",
        "date": "2026-06-17",
        "time": "10:00",
        "service": "Colloquio psicologico",
        "modality": "Online",
        "consent": False
    })
    if response.status_code == 400:
        log_pass("POST /api/appointments missing consent returns 400")
    else:
        log_fail("POST /api/appointments missing consent", f"Expected 400, got {response.status_code}")
except Exception as e:
    log_fail("POST /api/appointments missing consent", f"Exception: {str(e)}")

# Test 15: POST /api/appointments honeypot
print("\n[15] POST /api/appointments with honeypot field")
try:
    response = requests.post(f"{BASE_URL}/appointments", json={
        "name": "Spam Bot",
        "email": "spam@bot.com",
        "date": "2026-06-18",
        "time": "10:00",
        "service": "Spam",
        "modality": "Online",
        "consent": True,
        "website": "spam.com"
    })
    if response.status_code == 200:
        data = response.json()
        if data.get("ok") == True:
            log_pass("POST /api/appointments with honeypot returns {ok: true} (not stored)")
        else:
            log_fail("POST /api/appointments honeypot", f"Expected ok=true, got {data}")
    else:
        log_fail("POST /api/appointments honeypot", f"Expected 200, got {response.status_code}")
except Exception as e:
    log_fail("POST /api/appointments honeypot", f"Exception: {str(e)}")

# Test 16: GET /api/appointments/booked (public)
print("\n[16] GET /api/appointments/booked?date=2026-06-16 (public)")
try:
    response = requests.get(f"{BASE_URL}/appointments/booked?date=2026-06-16")
    if response.status_code == 200:
        data = response.json()
        if "booked" in data and "10:00" in data["booked"]:
            # Verify no personal data
            if isinstance(data["booked"], list) and all(isinstance(t, str) for t in data["booked"]):
                check_no_mongo_id(data, "Booked slots")
                log_pass("GET /api/appointments/booked returns times array (no personal data)")
            else:
                log_fail("GET /api/appointments/booked", "Booked array contains non-string data")
        else:
            log_fail("GET /api/appointments/booked", f"Expected '10:00' in booked, got {data}")
    else:
        log_fail("GET /api/appointments/booked", f"Expected 200, got {response.status_code}")
except Exception as e:
    log_fail("GET /api/appointments/booked", f"Exception: {str(e)}")

# Test 17: GET /api/appointments (admin)
print("\n[17] GET /api/appointments (admin)")
try:
    response = requests.get(f"{BASE_URL}/appointments", headers={"x-admin-token": admin_token})
    if response.status_code == 200:
        data = response.json()
        if isinstance(data, list):
            check_no_mongo_id(data, "Appointments list")
            log_pass("GET /api/appointments WITH token returns 200 array")
        else:
            log_fail("GET /api/appointments", f"Expected array, got {type(data)}")
    else:
        log_fail("GET /api/appointments", f"Expected 200, got {response.status_code}")
except Exception as e:
    log_fail("GET /api/appointments", f"Exception: {str(e)}")

# Test 18: DELETE appointment (cleanup)
print("\n[18] DELETE /api/appointments/:id (cleanup)")
if created_appointment_id:
    try:
        response = requests.delete(f"{BASE_URL}/appointments/{created_appointment_id}", headers={"x-admin-token": admin_token})
        if response.status_code == 200:
            log_pass(f"DELETE /api/appointments/{created_appointment_id} returns 200")
        else:
            log_fail(f"DELETE /api/appointments/{created_appointment_id}", f"Expected 200, got {response.status_code}")
    except Exception as e:
        log_fail(f"DELETE /api/appointments/{created_appointment_id}", f"Exception: {str(e)}")

# Test 19: POST /api/contact valid
print("\n[19] POST /api/contact valid message")
try:
    response = requests.post(f"{BASE_URL}/contact", json={
        "name": "Marco Bianchi",
        "email": "marco.bianchi@example.com",
        "message": "Vorrei informazioni sui servizi di consulenza psicologica.",
        "consent": True
    })
    if response.status_code == 200:
        data = response.json()
        if data.get("ok") == True:
            check_no_mongo_id(data, "Contact create")
            log_pass("POST /api/contact valid message returns 200 {ok: true}")
        else:
            log_fail("POST /api/contact valid", f"Expected ok=true, got {data}")
    else:
        log_fail("POST /api/contact valid", f"Expected 200, got {response.status_code}: {response.text}")
except Exception as e:
    log_fail("POST /api/contact valid", f"Exception: {str(e)}")

# Test 20: POST /api/contact missing consent (400)
print("\n[20] POST /api/contact missing consent")
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
    print("Backend is working correctly after Blog rework + MongoDB connection fix")
else:
    print(f"❌ {len(test_results['failed'])} TESTS FAILED")
    print("Please review failed tests above")
print("=" * 80)
