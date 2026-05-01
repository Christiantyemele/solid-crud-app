# Component Documentation

## UI Components

All UI components are located in `components/ui/` and follow a consistent API.

### Button

```tsx
import { Button } from '@/components/ui'

<Button variant="primary" size="md">Click me</Button>
```

**Props:**
- `variant`: `'primary' | 'secondary' | 'danger' | 'ghost'`
- `size`: `'sm' | 'md' | 'lg'`
- `disabled`: `boolean`
- `onClick`: `() => void`
- `className`: `string` (for additional Tailwind classes)

### Input

```tsx
import { Input } from '@/components/ui'

<Input label="Email" name="email" type="email" error="Invalid email" />
```

**Props:**
- `label`: `string`
- `error`: `string`
- All standard HTML input props

### Select

```tsx
import { Select } from '@/components/ui'

<Select
  label="Status"
  name="status"
  options={[
    { value: 'active', label: 'Active' },
    { value: 'inactive', label: 'Inactive' },
  ]}
/>
```

**Props:**
- `label`: `string`
- `error`: `string`
- `options`: `Array<{ value: string; label: string }>`
- All standard HTML select props

### Textarea

```tsx
import { Textarea } from '@/components/ui'

<Textarea label="Description" name="description" rows={4} />
```

**Props:**
- `label`: `string`
- `error`: `string`
- All standard HTML textarea props

### Card

```tsx
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui'

<Card>
  <CardHeader>Header content</CardHeader>
  <CardContent>Main content</CardContent>
  <CardFooter>Footer content</CardFooter>
</Card>
```

**Props:**
- `hover`: `boolean` (adds hover effect)
- All standard HTML div props

### Badge

```tsx
import { Badge } from '@/components/ui'

<Badge variant="success">Active</Badge>
```

**Props:**
- `variant`: `'default' | 'success' | 'warning' | 'danger' | 'info'`
- `className`: `string`

### Modal

```tsx
import { Modal } from '@/components/ui'

<Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title="My Modal">
  Modal content goes here
</Modal>
```

**Props:**
- `isOpen`: `boolean`
- `onClose`: `() => void`
- `title`: `string`

## Feature Components

Feature-specific components are located in `components/features/`.

### ProjectCard

Displays a project summary with status badge and task count.

### TaskCard

Displays a task with status, priority, and assignee information.

### CommentThread

Displays threaded comments with author avatars.
