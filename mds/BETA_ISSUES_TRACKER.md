# Beta Release Issues & Blockers Tracker

## Active Issues

### Critical Issues
(None currently)

### High Priority Issues
(None currently)

### Medium Priority Issues
(None currently)

### Low Priority Issues
(None currently)

---

## Known Limitations

### Current Limitations
1. Tailwind CSS support requires manual PostCSS integration
2. Watch mode may require manual rebuild in some cases
3. JavaScript templates not yet available (TypeScript only)

### Planned for Future Releases
- [ ] Native Tailwind CSS integration
- [ ] JavaScript template support
- [ ] Advanced routing features
- [ ] Plugin system
- [ ] Visual debugging tools

---

## Testing Issues Found

### Build System
- [ ] Issue: (description)
  - Status: Open/In Progress/Resolved
  - Severity: Critical/High/Medium/Low
  - Assigned to: (name)
  - Notes: (any notes)

### CLI
- [ ] Issue: (description)
  - Status: Open/In Progress/Resolved
  - Severity: Critical/High/Medium/Low
  - Assigned to: (name)
  - Notes: (any notes)

### Documentation
- [ ] Issue: (description)
  - Status: Open/In Progress/Resolved
  - Severity: Critical/High/Medium/Low
  - Assigned to: (name)
  - Notes: (any notes)

---

## Blockers

### Current Blockers
(None currently)

### Resolved Blockers
1. ~~Path and hash generation issues~~ - RESOLVED (Oct 27)
   - Fixed builder to use correct output filename
   - Fixed HTML validator patterns
   - Implemented content-based hashing

2. ~~Emoji removal from CLI~~ - IN PROGRESS
   - Need to remove from all logger functions
   - Need to remove from all command outputs

---

## Performance Issues

### Build Performance
- [ ] Issue: (description)
  - Current: (current time)
  - Target: (target time)
  - Status: (status)

### Runtime Performance
- [ ] Issue: (description)
  - Current: (current metric)
  - Target: (target metric)
  - Status: (status)

---

## Security Issues

### Vulnerabilities Found
(None currently)

### Security Audit Results
- [ ] Dependency audit: (status)
- [ ] Code review: (status)
- [ ] Security best practices: (status)

---

## Browser Compatibility Issues

### Chrome
- [ ] Issue: (description)
  - Status: Open/In Progress/Resolved
  - Workaround: (if any)

### Firefox
- [ ] Issue: (description)
  - Status: Open/In Progress/Resolved
  - Workaround: (if any)

### Safari
- [ ] Issue: (description)
  - Status: Open/In Progress/Resolved
  - Workaround: (if any)

### Mobile
- [ ] Issue: (description)
  - Status: Open/In Progress/Resolved
  - Workaround: (if any)

---

## Documentation Issues

### README
- [ ] Issue: (description)
  - Status: Open/In Progress/Resolved
  - Priority: High/Medium/Low

### API Docs
- [ ] Issue: (description)
  - Status: Open/In Progress/Resolved
  - Priority: High/Medium/Low

### CLI Docs
- [ ] Issue: (description)
  - Status: Open/In Progress/Resolved
  - Priority: High/Medium/Low

### Examples
- [ ] Issue: (description)
  - Status: Open/In Progress/Resolved
  - Priority: High/Medium/Low

---

## User Feedback

### Feedback from Testing
(Collect feedback from testers)

### Community Feedback
(Collect feedback from community)

### Feature Requests
- [ ] Request: (description)
  - Priority: High/Medium/Low
  - Status: Open/Planned/In Progress

---

## Regression Tests

### Tests That Must Pass
- [ ] Build workflow
- [ ] Dev server
- [ ] Clean command
- [ ] All CLI commands
- [ ] Template generation
- [ ] Hash generation
- [ ] Compression

### Tests Status
| Test | Status | Notes |
|------|--------|-------|
| Build workflow | Pending | |
| Dev server | Pending | |
| Clean command | Pending | |
| CLI commands | Pending | |
| Template generation | Pending | |
| Hash generation | Pending | |
| Compression | Pending | |

---

## Resolution Log

### Resolved Issues
1. **Path and Hash Generation** (Oct 27, 2025)
   - Issue: Bundle filenames not using correct output from config
   - Solution: Fixed builder.ts to use options.output basename
   - Commit: e049466
   - Status: RESOLVED

2. **Emoji Removal** (In Progress)
   - Issue: CLI output contains emojis
   - Solution: Removing all emoji characters from logger and prompts
   - Status: IN PROGRESS

---

## Next Steps

1. Start Phase 1 cleanup
2. Document any new issues found
3. Update this file regularly
4. Review blockers weekly
5. Escalate critical issues immediately

---

## Issue Severity Levels

### Critical
- Prevents build or deployment
- Security vulnerability
- Data loss risk
- Immediate action required

### High
- Major feature broken
- Significant performance issue
- Affects multiple users
- Should fix before release

### Medium
- Minor feature broken
- Workaround available
- Affects some users
- Can fix in next release

### Low
- Nice to have fix
- No workaround needed
- Affects few users
- Can defer to future release

---

## Reporting Issues

When reporting an issue, include:
1. Description of the problem
2. Steps to reproduce
3. Expected behavior
4. Actual behavior
5. Environment (OS, Node version, etc.)
6. Screenshots/logs if applicable
7. Severity level
8. Suggested fix (if any)

---

**Last Updated**: October 27, 2025
**Status**: Tracking Active Issues
**Next Review**: (To be scheduled)
