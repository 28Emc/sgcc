# SGCC Design System

> Version: 1.0
>
> Product: SGCC
>
> Design Foundation: Material Design 3
>
> Last Updated: 2026-07-23

---

## 1. Purpose

This document defines the visual language, interaction patterns, and user experience principles for SGCC.

It is the single source of truth for designers, frontend developers, and AI coding agents.

Every screen, component, workflow, and generated interface must comply with this document.

---

## 2. Product Vision

SGCC is an enterprise utility management platform designed to optimize consumption management, billing operations, customer management, and operational visibility.

The platform transforms complex utility processes into efficient and predictable workflows.

SGCC is not only a billing system.

It is an operational intelligence platform.

---

## 3. Product Values

SGCC is built around five principles.

### Efficiency

Every interaction should help users complete tasks faster.

The interface should minimize unnecessary steps.

### Visibility

Important operational information should always be accessible.

Users should quickly understand:

- Current status.
- Pending actions.
- Operational problems.

### Reliability

Enterprise users depend on accurate information.

The interface should communicate trust and consistency.

### Control

Users need tools to manage large volumes of data.

- Search.
- Filters.
- Tables.
- Bulk actions.
- Auditing.

### Scalability

The design system must support future modules without redesign.

Examples:

- Asset Management.
- Maintenance.
- IoT Monitoring.
- Analytics.

---

## 4. Brand Personality

SGCC behaves like an enterprise operations command center.

It is:

- Efficient
- Precise
- Reliable
- Structured
- Professional
- Data-driven
- Clear

It is NOT:

- Playful
- Decorative
- Experimental
- Emotion-heavy
- Marketing-oriented

---

## 5. Emotional Goals

Primary Emotion

Efficiency

Secondary Emotions

Confidence

Control

Trust

Clarity

Users should feel:

"I can manage operations quickly."

"I understand what requires attention."

---

## 6. Target Audience

Primary Users

- Utility operators.
- Billing teams.
- Customer service agents.
- Field operation teams.
- Administrators.

Secondary Users

- Managers.
- Analysts.
- Auditors.

---

## 7. Design Philosophy

SGCC follows six principles.

### 7.1 Data First

Information is the primary product.

The interface should optimize data visibility.

### 7.2 Operational Efficiency

Every workflow should reduce completion time.

Avoid unnecessary navigation.

### 7.3 Consistent Enterprise Patterns

Users should not relearn interfaces between modules.

- Customers.
- Meters.
- Billing.
- Payments.
- Reports.

### 7.4 Progressive Complexity

Simple workflows should remain simple.

Advanced capabilities should appear when needed.

### 7.5 Traceability

Enterprise actions require history.

Auditing and activity tracking are first-class concepts.

### 7.6 Predictability

Enterprise users value consistency more than novelty.

---

## 8. AI Design Priorities

When generating new SGCC interfaces, AI agents MUST prioritize:

Priority 1

Operational efficiency.

Priority 2

Data readability.

Priority 3

Fast navigation and task completion.

Priority 4

Consistency between modules.

Priority 5

Respect Material Design 3.

When design decisions conflict:

Efficiency is more important than visual decoration.

---

## 9. Design Foundation

SGCC uses:

Material Design 3

as the primary design foundation.

Material components should remain recognizable.

Customization should happen through:

- Enterprise workflows
- Data components
- Domain components
- Layout patterns

Never redesign Material components without justification.

---

## 10. Inspiration

Primary Inspiration

Datadog

Used for:

- Operational visibility
- Monitoring mindset
- Status communication
- Data visualization

Secondary Inspirations

Azure Portal

Used for:

- Enterprise navigation
- Resource management
- Operational workflows

Microsoft Dynamics 365

Used for:

- Business processes
- CRUD workflows
- Customer operations

---

## 11. Visual Identity

SGCC should feel:

Professional

Reliable

Structured

Technical

Efficient

Clear

The interface should help operators make decisions quickly.

---

## 12. Core Interaction Model

The primary interaction unit is:

Enterprise Data Table

Tables are preferred for:

- Customers.
- Meters.
- Invoices.
- Payments.
- Consumption records.
- Operational logs.

Cards are secondary.

Cards should summarize information.

They should not replace tables for large datasets.

---

## 13. Layout Grammar

Main SGCC layout pattern:

```
Application Header
  ↓
Page Header
  ↓
Action Toolbar
  ↓
Search
  ↓
Filters
  ↓
Data Table
  ↓
Pagination
  ↓
Detail Drawer
```

Dashboard pattern:

```
KPIs
  ↓
Operational Charts
  ↓
Alerts
  ↓
Recent Activity
  ↓
Detailed Tables
```

---

## 14. Design Tokens

SGCC uses semantic design tokens.

Tokens represent meaning and usage instead of specific visual values.

The implementation can evolve without breaking the design language.

---

## 15. Color System

Color in SGCC communicates:

- Status.
- Priority.
- Operational state.
- Actions.

Color should never exist only for decoration.

---

## 16. Primary Role

Purpose:

- Main actions.
- Navigation emphasis.
- Important selections.

The primary color should communicate:

- Trust.
- Stability.
- Technology.

---

## 17. Secondary Role

Purpose:

- Supporting actions.
- Secondary workflows.
- Additional information.

---

## 18. Surface Roles

### Background

Application workspace.

### Surface

- Cards.
- Panels.
- Dialogs.
- Drawers.

### Surface Container

Grouped operational information.

Dashboard sections.

Summary blocks.

---

## 19. Semantic Colors

### Success

Examples:

- Completed payment.
- Active service.
- Successful operation.

### Warning

Examples:

- Pending billing.
- Consumption anomaly.
- Attention required.

### Error

Examples:

- Failed process.
- Disconnected meter.
- Invalid operation.

### Information

Examples:

- System updates.
- Recommendations.
- Operational notices.

Never communicate status only through color.

Always include:

- Text.
- Icon.
- Status label.

---

## 20. Data Visualization Colors

Charts should use semantic meaning.

Examples:

- Consumption increase.
- Consumption decrease.
- Operational alerts.
- Comparisons.

Avoid:

- Decorative gradients.
- Excessive colors.
- Unnecessary visual effects.

---

## 21. Typography

Primary Font

Inter

Fallback:

Roboto

System UI

Arial

Typography should prioritize:

- Density control.
- Readability.
- Scanning speed.

---

## 22. Typography Hierarchy

Display

Rarely used.

Reserved for executive dashboards.

Headline

Page titles.

Main metrics.

Title

Sections.

Panels.

Entities.

Body

Descriptions.

Information.

Instructions.

Label

Buttons.

Filters.

Columns.

Caption

Metadata.

Dates.

Identifiers.

---

## 23. Text Rules

Use operational language.

Prefer:

"Meter disconnected"

Instead of:

"An unexpected infrastructure state was detected."

Messages should answer:

- What happened?
- Why does it matter?
- What can the user do?

Never expose:

- Technical stack traces.
- Internal exceptions.
- Database errors.

---

## 24. Spacing System

Base Unit:

8dp

Allowed spacing:

- 4
- 8
- 12
- 16
- 24
- 32
- 40
- 48
- 64

Enterprise interfaces require balance.

Avoid:

- Overcrowded screens.
- Excessive empty space.

---

## 25. Shape System

Border Radius:

Small

8dp

Medium

12dp

Large

16dp

Extra Large

24dp

SGCC should feel structured.

Avoid excessive rounded consumer-style interfaces.

---

## 26. Elevation

Use Material elevation.

Recommended:

Background

0

Cards

1

Panels

1

Drawers

3

Dialogs

4

Elevation communicates hierarchy.

Not decoration.

---

## 27. Motion

Motion should be functional.

Recommended:

150-250ms

Allowed:

- Drawer opening.
- Table updates.
- Filtering.
- Saving feedback.
- Navigation transitions.

Avoid:

- Large animations.
- Decorative transitions.
- Attention effects.

---

## 28. Responsive Strategy

Desktop First.

SGCC is primarily an operational platform.

Desktop:

- Large data tables.
- Multiple panels.
- Advanced filtering.
- Detailed workflows.

Tablet:

- Reduced density.
- Adapted tables.

Mobile:

- Critical operations only.
- Quick actions.
- Field workflows.

Never force a mobile layout on complex enterprise workflows.

---

## 29. Accessibility

Every screen must support:

- Keyboard navigation.
- Screen readers.
- Visible focus.
- High contrast.
- Large interactive targets.
- Reduced motion.

Enterprise users often work long hours.

Accessibility improves productivity.

---

## 30. Dark Mode

Dark mode is supported.

Purpose:

- Long operational sessions.
- Monitoring environments.
- Reduced eye strain.

Dark mode must preserve:

- Table readability.
- Chart clarity.
- Status visibility.

Avoid:

- Pure black.
- Low contrast text.
- Hidden separators.

---

## 31. Component Library

SGCC extends Material Design 3 through enterprise-specific components.

Custom components should represent operational concepts.

Do not create custom components only for visual differences.

---

## 32. Component Hierarchy

The main interaction hierarchy is:

```
SGCC Application
├── Layout Components
│
├── Navigation Components
│
├── Dashboard Components
│
├── Data Components
│
├── Business Components
│
└── Shared Components
```

---

## 33. Data Table

Data Table is the primary interaction component of SGCC.

Purpose:

Manage large volumes of operational data.

Required capabilities:

```yaml
DataTable:
  required:
    - columns
    - sorting
    - filtering
    - pagination
    - loadingState
    - emptyState
    - errorState

  optional:
    - bulkSelection
    - export
    - columnVisibility
    - rowActions
```

Supported actions:

- View detail
- Edit
- Delete
- Export
- Bulk operations

Rules:

Data tables should be preferred over cards for large datasets.

Never hide important operational information inside expandable rows only.

---

## 34. KPI Card

Purpose:

Summarize operational metrics.

Used in:

- Dashboards.
- Reports.
- Executive views.

Required:

```yaml
KPICard:
  required:
    - title
    - value

  optional:
    - trend
    - comparison
    - status
```

Examples:

- Total Customers.
- Active Meters.
- Pending Payments.
- Consumption Alerts.

---

## 35. Status Chip

Purpose:

Represent operational state.

Examples:

- Active.
- Inactive.
- Pending.
- Completed.
- Failed.
- Disconnected.

Rules:

Status chips must include text.

Color alone is insufficient.

---

## 36. Customer Summary

Purpose:

Display customer context.

Contains:

- Customer identity.
- Account status.
- Service information.
- Billing summary.
- Recent activity.

Used in:

- Customer details.
- Support workflows.

---

## 37. Meter Card

Purpose:

Represent meter information.

Contains:

- Meter identifier.
- Status.
- Location.
- Consumption summary.
- Last reading.

Actions:

- View.
- Configure.
- History.

---

## 38. Consumption Chart

Purpose:

Visualize usage patterns.

Supported:

- Line charts.
- Bar charts.
- Comparisons.
- Trends.

Required:

- Title.
- Legend.
- Units.
- Time range.

Never create charts without business meaning.

---

## 39. Billing Timeline

Purpose:

Display chronological billing events.

Contains:

- Date.
- Event.
- Status.
- User.
- Action.

Used for:

- Invoices.
- Payments.
- Auditing.

---

## 40. Detail Drawer

Detail Drawer is the preferred editing pattern.

Purpose:

Maintain user context.

Used for:

- Customers.
- Meters.
- Invoices.
- Payments.
- Incidents.

Structure:

```
Summary
  ↓
Details
  ↓
Actions
  ↓
History
```

Avoid opening unnecessary pages.

---

## 41. Forms

Forms should optimize operational efficiency.

Preferred controls:

- Autocomplete.
- Select.
- Date picker.
- Masked input.
- Number input.
- Validation.

Large forms should use sections.

Rules:

- Minimize typing.
- Provide defaults.
- Validate early.

---

## 42. Filters

Filters are mandatory for large datasets.

Supported:

- Search.
- Date range.
- Status.
- Category.
- Advanced filters.

Default experience:

- Simple search.
- Optional advanced filtering.

---

## 43. Search

Search is a primary workflow.

Examples:

- Search customer.
- Search meter.
- Search invoice.
- Search payment.

Search should support:

- Suggestions.
- Recent searches.
- Fast results.

---

## 44. Dashboard Components

Dashboards should contain:

- KPI cards.
- Operational charts.
- Alerts.
- Recent activity.
- Tables.

Dashboards answer:

"What needs attention?"

---

## 45. Screen Inventory

Main SGCC screens:

- Dashboard
- Customers
- Customer Detail
- Meters
- Meter Detail
- Billing
- Invoices
- Payments
- Consumption
- Reports
- Audit
- Settings

---

## 46. CRUD Pattern

All CRUD modules should follow:

```
Page Header
  ↓
Primary Actions
  ↓
Search
  ↓
Filters
  ↓
Data Table
  ↓
Pagination
  ↓
Detail Drawer
  ↓
Audit History
```

Users should recognize the pattern instantly.

---

## 47. Anti Patterns

AI agents must avoid:

Card-Based Data Management

Do not use cards to replace tables.

Large datasets require tables.

Decorative Dashboards

Avoid:

- Excessive graphs.
- Animations.
- Unnecessary widgets.

Hidden Operations

Do not hide primary actions inside menus.

Inconsistent CRUD

Every module should follow the same structure.

Excessive Dialog Usage

Do not create complex workflows inside dialogs.

Prefer pages or drawers.

---

## 48. AI Generation Rules

When generating SGCC interfaces:

Always:

- ✓ Use Material Design 3.
- ✓ Prefer data tables.
- ✓ Prioritize operational efficiency.
- ✓ Maintain enterprise patterns.
- ✓ Include filters.
- ✓ Include loading states.
- ✓ Include empty states.
- ✓ Include error states.
- ✓ Preserve user context.
- ✓ Reuse components.

Never:

- ✗ Build consumer-style interfaces.
- ✗ Replace tables with cards.
- ✗ Create decorative screens.
- ✗ Hide important actions.
- ✗ Invent new layouts.
- ✗ Ignore audit requirements.

---

## 49. Design Checklist

Before approving any screen:

- [ ] Material Design 3 compliant
- [ ] Enterprise layout
- [ ] Desktop-first
- [ ] Accessible
- [ ] Uses existing components
- [ ] Data density is appropriate
- [ ] Search available
- [ ] Filters available
- [ ] Loading state included
- [ ] Empty state included
- [ ] Error handling included
- [ ] Dark mode compatible
- [ ] Internationalization ready
- [ ] Audit considered

---

## 50. Final Principle

SGCC exists to help organizations operate utility services efficiently.

Every design decision should reduce operational effort.

If a visual improvement makes workflows slower or information harder to find, efficiency always wins.
