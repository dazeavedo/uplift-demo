#!/bin/bash

# ============================================================
# UPLIFT - COMPREHENSIVE E2E & UAT TEST RUNNER
# Orchestrates all end-to-end tests across the platform
# ============================================================

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
TEST_ENV="${TEST_ENV:-staging}"
REPORT_DIR="./test-results"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)

# ============================================================
# HELPER FUNCTIONS
# ============================================================

log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

print_header() {
    echo ""
    echo "============================================================"
    echo -e "${BLUE}$1${NC}"
    echo "============================================================"
    echo ""
}

# ============================================================
# SETUP
# ============================================================

setup() {
    print_header "SETTING UP TEST ENVIRONMENT"
    
    # Create report directory
    mkdir -p "$REPORT_DIR"
    mkdir -p "$REPORT_DIR/api"
    mkdir -p "$REPORT_DIR/portal"
    mkdir -p "$REPORT_DIR/mobile"
    mkdir -p "$REPORT_DIR/coverage"
    
    # Check dependencies
    log_info "Checking dependencies..."
    
    if ! command -v node &> /dev/null; then
        log_error "Node.js not found. Please install Node.js 18+."
        exit 1
    fi
    
    if ! command -v npm &> /dev/null; then
        log_error "npm not found. Please install npm."
        exit 1
    fi
    
    log_success "Dependencies check passed"
    
    # Install test dependencies
    log_info "Installing test dependencies..."
    npm install --save-dev vitest supertest playwright @playwright/test
    
    # Setup Playwright browsers
    log_info "Setting up Playwright browsers..."
    npx playwright install --with-deps
    
    log_success "Setup complete"
}

# ============================================================
# API E2E TESTS
# ============================================================

run_api_tests() {
    print_header "RUNNING API E2E TESTS"
    
    log_info "Starting API E2E test suite..."
    
    # Run vitest for API tests
    npx vitest run tests/e2e/api.e2e.test.js \
        --reporter=verbose \
        --reporter=json \
        --outputFile="$REPORT_DIR/api/results.json" \
        2>&1 | tee "$REPORT_DIR/api/output.log"
    
    if [ $? -eq 0 ]; then
        log_success "API E2E tests passed"
        return 0
    else
        log_error "API E2E tests failed"
        return 1
    fi
}

# ============================================================
# PORTAL E2E TESTS
# ============================================================

run_portal_tests() {
    print_header "RUNNING PORTAL E2E TESTS"
    
    log_info "Starting Portal E2E test suite..."
    
    # Start portal in background if not running
    if ! curl -s http://localhost:5173 > /dev/null; then
        log_info "Starting portal dev server..."
        npm run dev:portal &
        PORTAL_PID=$!
        sleep 10
    fi
    
    # Run Playwright tests
    npx playwright test tests/e2e/portal.e2e.test.ts \
        --config=playwright.config.ts \
        --reporter=html \
        --output="$REPORT_DIR/portal" \
        2>&1 | tee "$REPORT_DIR/portal/output.log"
    
    TEST_RESULT=$?
    
    # Stop portal if we started it
    if [ ! -z "$PORTAL_PID" ]; then
        kill $PORTAL_PID 2>/dev/null
    fi
    
    if [ $TEST_RESULT -eq 0 ]; then
        log_success "Portal E2E tests passed"
        return 0
    else
        log_error "Portal E2E tests failed"
        return 1
    fi
}

# ============================================================
# MOBILE E2E TESTS
# ============================================================

run_mobile_tests_ios() {
    print_header "RUNNING MOBILE E2E TESTS (iOS)"
    
    log_info "Starting iOS E2E test suite..."
    
    cd mobile
    
    # Build iOS app
    log_info "Building iOS app..."
    npx detox build --configuration ios.sim.debug
    
    # Run Detox tests
    npx detox test --configuration ios.sim.debug \
        --loglevel info \
        --record-logs all \
        --artifacts-location "$REPORT_DIR/mobile/ios" \
        2>&1 | tee "$REPORT_DIR/mobile/ios-output.log"
    
    TEST_RESULT=$?
    
    cd ..
    
    if [ $TEST_RESULT -eq 0 ]; then
        log_success "iOS E2E tests passed"
        return 0
    else
        log_error "iOS E2E tests failed"
        return 1
    fi
}

run_mobile_tests_android() {
    print_header "RUNNING MOBILE E2E TESTS (Android)"
    
    log_info "Starting Android E2E test suite..."
    
    cd mobile
    
    # Build Android app
    log_info "Building Android app..."
    npx detox build --configuration android.emu.debug
    
    # Run Detox tests
    npx detox test --configuration android.emu.debug \
        --loglevel info \
        --record-logs all \
        --artifacts-location "$REPORT_DIR/mobile/android" \
        2>&1 | tee "$REPORT_DIR/mobile/android-output.log"
    
    TEST_RESULT=$?
    
    cd ..
    
    if [ $TEST_RESULT -eq 0 ]; then
        log_success "Android E2E tests passed"
        return 0
    else
        log_error "Android E2E tests failed"
        return 1
    fi
}

# ============================================================
# UNIT TESTS
# ============================================================

run_unit_tests() {
    print_header "RUNNING UNIT TESTS"
    
    log_info "Starting unit test suite..."
    
    npx vitest run tests/auth.test.js \
        --coverage \
        --reporter=verbose \
        --reporter=json \
        --outputFile="$REPORT_DIR/coverage/results.json" \
        2>&1 | tee "$REPORT_DIR/coverage/output.log"
    
    if [ $? -eq 0 ]; then
        log_success "Unit tests passed"
        return 0
    else
        log_error "Unit tests failed"
        return 1
    fi
}

# ============================================================
# I18N VALIDATION
# ============================================================

run_i18n_validation() {
    print_header "RUNNING I18N VALIDATION"
    
    log_info "Validating translations..."
    
    node << 'EOF'
const fs = require('fs');
const path = require('path');

const LOCALES_DIR = './mobile/src/i18n/locales';
const PORTAL_LOCALES_DIR = './portal/src/i18n/locales';

function countKeys(obj) {
    let count = 0;
    for (const value of Object.values(obj)) {
        if (typeof value === 'object' && value !== null) {
            count += countKeys(value);
        } else {
            count++;
        }
    }
    return count;
}

function validateLocales(dir, name) {
    console.log(`\nValidating ${name} locales...`);
    
    const files = fs.readdirSync(dir).filter(f => f.endsWith('.json'));
    const results = [];
    let enKeys = 0;
    
    for (const file of files) {
        const lang = file.replace('.json', '');
        const data = JSON.parse(fs.readFileSync(path.join(dir, file), 'utf-8'));
        const keys = countKeys(data);
        
        if (lang === 'en') enKeys = keys;
        results.push({ lang, keys });
    }
    
    // Find max keys (should be ~1228 for complete translations)
    const maxKeys = Math.max(...results.map(r => r.keys));
    
    let passed = 0;
    let failed = 0;
    
    for (const { lang, keys } of results) {
        if (lang === 'en') continue; // Skip base file
        
        if (keys >= maxKeys) {
            passed++;
        } else {
            failed++;
            console.log(`  ⚠️  ${lang}: ${keys}/${maxKeys} keys (${Math.round(keys/maxKeys*100)}%)`);
        }
    }
    
    console.log(`  ✅ Complete: ${passed} languages`);
    if (failed > 0) {
        console.log(`  ❌ Incomplete: ${failed} languages`);
    }
    
    return failed === 0;
}

// Validate mobile locales
const mobileValid = validateLocales(LOCALES_DIR, 'Mobile');

// Validate portal locales if they exist
let portalValid = true;
if (fs.existsSync(PORTAL_LOCALES_DIR)) {
    portalValid = validateLocales(PORTAL_LOCALES_DIR, 'Portal');
}

process.exit(mobileValid && portalValid ? 0 : 1);
EOF
    
    if [ $? -eq 0 ]; then
        log_success "I18N validation passed"
        return 0
    else
        log_warning "I18N validation has warnings"
        return 0  # Don't fail the build for incomplete translations
    fi
}

# ============================================================
# GENERATE REPORT
# ============================================================

generate_report() {
    print_header "GENERATING TEST REPORT"
    
    cat > "$REPORT_DIR/summary.html" << EOF
<!DOCTYPE html>
<html>
<head>
    <title>Uplift E2E Test Report - $TIMESTAMP</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, sans-serif; max-width: 1200px; margin: 0 auto; padding: 20px; }
        h1 { color: #FF6B35; }
        .section { margin: 20px 0; padding: 20px; border: 1px solid #ddd; border-radius: 8px; }
        .passed { color: #22c55e; }
        .failed { color: #ef4444; }
        .warning { color: #f59e0b; }
        table { width: 100%; border-collapse: collapse; }
        th, td { padding: 12px; text-align: left; border-bottom: 1px solid #ddd; }
        th { background: #f5f5f5; }
    </style>
</head>
<body>
    <h1>🚀 Uplift E2E Test Report</h1>
    <p>Generated: $(date)</p>
    <p>Environment: $TEST_ENV</p>
    
    <div class="section">
        <h2>Test Summary</h2>
        <table>
            <tr><th>Test Suite</th><th>Status</th><th>Details</th></tr>
            <tr><td>API E2E Tests</td><td class="${API_STATUS:-pending}">$API_STATUS</td><td><a href="api/output.log">View Log</a></td></tr>
            <tr><td>Portal E2E Tests</td><td class="${PORTAL_STATUS:-pending}">$PORTAL_STATUS</td><td><a href="portal/index.html">View Report</a></td></tr>
            <tr><td>Mobile iOS Tests</td><td class="${IOS_STATUS:-pending}">$IOS_STATUS</td><td><a href="mobile/ios">View Artifacts</a></td></tr>
            <tr><td>Mobile Android Tests</td><td class="${ANDROID_STATUS:-pending}">$ANDROID_STATUS</td><td><a href="mobile/android">View Artifacts</a></td></tr>
            <tr><td>Unit Tests</td><td class="${UNIT_STATUS:-pending}">$UNIT_STATUS</td><td><a href="coverage/output.log">View Log</a></td></tr>
            <tr><td>I18N Validation</td><td class="${I18N_STATUS:-pending}">$I18N_STATUS</td><td>48 languages</td></tr>
        </table>
    </div>
    
    <div class="section">
        <h2>Coverage Summary</h2>
        <p>See detailed coverage report in <a href="coverage/">coverage/</a></p>
    </div>
    
    <div class="section">
        <h2>Test Artifacts</h2>
        <ul>
            <li><a href="api/">API Test Results</a></li>
            <li><a href="portal/">Portal Test Results</a></li>
            <li><a href="mobile/">Mobile Test Artifacts</a></li>
        </ul>
    </div>
</body>
</html>
EOF
    
    log_success "Report generated at $REPORT_DIR/summary.html"
}

# ============================================================
# MAIN EXECUTION
# ============================================================

main() {
    print_header "UPLIFT E2E & UAT TEST SUITE"
    echo "Environment: $TEST_ENV"
    echo "Timestamp: $TIMESTAMP"
    echo ""
    
    # Parse arguments
    RUN_ALL=true
    RUN_API=false
    RUN_PORTAL=false
    RUN_MOBILE=false
    RUN_UNIT=false
    RUN_I18N=false
    
    while [[ $# -gt 0 ]]; do
        case $1 in
            --api) RUN_API=true; RUN_ALL=false ;;
            --portal) RUN_PORTAL=true; RUN_ALL=false ;;
            --mobile) RUN_MOBILE=true; RUN_ALL=false ;;
            --mobile-ios) RUN_MOBILE_IOS=true; RUN_ALL=false ;;
            --mobile-android) RUN_MOBILE_ANDROID=true; RUN_ALL=false ;;
            --unit) RUN_UNIT=true; RUN_ALL=false ;;
            --i18n) RUN_I18N=true; RUN_ALL=false ;;
            --setup) setup; exit 0 ;;
            --help)
                echo "Usage: $0 [options]"
                echo "Options:"
                echo "  --api           Run API E2E tests only"
                echo "  --portal        Run Portal E2E tests only"
                echo "  --mobile        Run all Mobile E2E tests"
                echo "  --mobile-ios    Run iOS E2E tests only"
                echo "  --mobile-android Run Android E2E tests only"
                echo "  --unit          Run unit tests only"
                echo "  --i18n          Run i18n validation only"
                echo "  --setup         Set up test environment"
                echo "  --help          Show this help"
                exit 0
                ;;
            *) log_error "Unknown option: $1"; exit 1 ;;
        esac
        shift
    done
    
    # Track overall status
    OVERALL_STATUS=0
    
    # Run setup
    setup
    
    # Run selected tests
    if [ "$RUN_ALL" = true ] || [ "$RUN_UNIT" = true ]; then
        if run_unit_tests; then
            UNIT_STATUS="passed"
        else
            UNIT_STATUS="failed"
            OVERALL_STATUS=1
        fi
    fi
    
    if [ "$RUN_ALL" = true ] || [ "$RUN_API" = true ]; then
        if run_api_tests; then
            API_STATUS="passed"
        else
            API_STATUS="failed"
            OVERALL_STATUS=1
        fi
    fi
    
    if [ "$RUN_ALL" = true ] || [ "$RUN_PORTAL" = true ]; then
        if run_portal_tests; then
            PORTAL_STATUS="passed"
        else
            PORTAL_STATUS="failed"
            OVERALL_STATUS=1
        fi
    fi
    
    if [ "$RUN_ALL" = true ] || [ "$RUN_MOBILE" = true ] || [ "$RUN_MOBILE_IOS" = true ]; then
        if run_mobile_tests_ios; then
            IOS_STATUS="passed"
        else
            IOS_STATUS="failed"
            OVERALL_STATUS=1
        fi
    fi
    
    if [ "$RUN_ALL" = true ] || [ "$RUN_MOBILE" = true ] || [ "$RUN_MOBILE_ANDROID" = true ]; then
        if run_mobile_tests_android; then
            ANDROID_STATUS="passed"
        else
            ANDROID_STATUS="failed"
            OVERALL_STATUS=1
        fi
    fi
    
    if [ "$RUN_ALL" = true ] || [ "$RUN_I18N" = true ]; then
        if run_i18n_validation; then
            I18N_STATUS="passed"
        else
            I18N_STATUS="warning"
        fi
    fi
    
    # Generate report
    generate_report
    
    # Final summary
    print_header "TEST EXECUTION COMPLETE"
    
    echo "Results Summary:"
    echo "  Unit Tests:     ${UNIT_STATUS:-skipped}"
    echo "  API E2E Tests:  ${API_STATUS:-skipped}"
    echo "  Portal Tests:   ${PORTAL_STATUS:-skipped}"
    echo "  iOS Tests:      ${IOS_STATUS:-skipped}"
    echo "  Android Tests:  ${ANDROID_STATUS:-skipped}"
    echo "  I18N Validation: ${I18N_STATUS:-skipped}"
    echo ""
    echo "Report: $REPORT_DIR/summary.html"
    echo ""
    
    if [ $OVERALL_STATUS -eq 0 ]; then
        log_success "All tests passed!"
    else
        log_error "Some tests failed. Check the report for details."
    fi
    
    exit $OVERALL_STATUS
}

# Run main function
main "$@"
