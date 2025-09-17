#!/bin/bash

# E2E Test Runner Script for @fanslib/e2e
# This script provides convenient commands for running e2e tests

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Helper function to print colored output
print_status() {
    echo -e "${BLUE}[E2E]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[E2E]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[E2E]${NC} $1"
}

print_error() {
    echo -e "${RED}[E2E]${NC} $1"
}

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Function to check if services are running
check_services() {
    print_status "Checking if services are running..."

    # Check web app (port 3000)
    if curl -s http://localhost:3000 >/dev/null; then
        print_success "Web app is running on port 3000"
    else
        print_warning "Web app is not running on port 3000"
    fi

    # Check API server (port 8000)
    if curl -s http://localhost:8000 >/dev/null; then
        print_success "API server is running on port 8000"
    else
        print_warning "API server is not running on port 8000"
    fi
}

# Function to install playwright browsers
install_browsers() {
    print_status "Installing Playwright browsers..."
    bun run install-browsers
    print_success "Playwright browsers installed"
}

# Function to run tests
run_tests() {
    local mode="$1"

    case "$mode" in
        "headed")
            print_status "Running tests in headed mode..."
            bun run test:headed
            ;;
        "ui")
            print_status "Running tests in UI mode..."
            bun run test:ui
            ;;
        "debug")
            print_status "Running tests in debug mode..."
            bun run test:debug
            ;;
        "report")
            print_status "Opening test report..."
            bun run report
            ;;
        *)
            print_status "Running tests in headless mode..."
            bun run test
            ;;
    esac
}

# Function to show help
show_help() {
    echo "E2E Test Runner for @fanslib/e2e"
    echo ""
    echo "Usage: $0 [command]"
    echo ""
    echo "Commands:"
    echo "  test          Run tests in headless mode (default)"
    echo "  test:headed   Run tests with browser UI visible"
    echo "  test:ui       Run tests with Playwright UI"
    echo "  test:debug    Run tests in debug mode"
    echo "  report        Open the latest test report"
    echo "  install       Install Playwright browsers"
    echo "  check         Check if required services are running"
    echo "  help          Show this help message"
    echo ""
    echo "Examples:"
    echo "  $0                 # Run tests in headless mode"
    echo "  $0 test:headed     # Run tests with browser visible"
    echo "  $0 install         # Install browsers"
    echo "  $0 check           # Check service status"
}

# Main script logic
main() {
    # Check if bun is installed
    if ! command_exists bun; then
        print_error "Bun is not installed. Please install Bun first."
        exit 1
    fi

    local command="${1:-test}"

    case "$command" in
        "test")
            check_services
            run_tests
            ;;
        "test:headed")
            check_services
            run_tests "headed"
            ;;
        "test:ui")
            check_services
            run_tests "ui"
            ;;
        "test:debug")
            check_services
            run_tests "debug"
            ;;
        "report")
            run_tests "report"
            ;;
        "install")
            install_browsers
            ;;
        "check")
            check_services
            ;;
        "help"|"-h"|"--help")
            show_help
            ;;
        *)
            print_error "Unknown command: $command"
            echo ""
            show_help
            exit 1
            ;;
    esac
}

# Run the main function with all arguments
main "$@"
