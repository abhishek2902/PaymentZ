import { Icon } from '@iconify/react';
import React, { useRef, useState } from 'react';

import { alpha } from '@mui/material/styles';
import { Box, Chip, Stack, Button, Typography } from '@mui/material';

function fmtSize(b) {
  if (b > 1024 * 1024) return `${(b / 1048576).toFixed(1)} MB`;
  if (b > 1024) return `${(b / 1024).toFixed(0)} KB`;
  return `${b} B`;
}

/**
 * UploadTile
 * - value: File | null  OR  File[] (when multiple)
 * - onChange(nextValue, errorText?) => void
 */
export default function UploadTile({
  label,
  caption,
  value,
  onChange,
  multiple = false,
  // accept = 'application/pdf,image/*',
  accept = 'application/pdf',
  maxSizeMB = 2,
  error,
}) {
  const inputRef = useRef(null);
  const [dragOver, setDragOver] = useState(false);

  const toArray = (v) => (Array.isArray(v) ? v : v ? [v] : []);
  const files = toArray(value);

  const validateAndAdd = (file) => {
    if (!file) return;
    // eslint-disable-next-line consistent-return
    if (file.size > maxSizeMB * 1048576) return onChange?.(value, `Max ${maxSizeMB}MB allowed`);
    const ok = accept.split(',').some((a) => {
      a = a.trim();
      if (a.endsWith('/*')) return file.type.startsWith(a.replace('/*', '/'));
      return a === file.type || (a === 'image/*' && file.type.startsWith('image/'));
    });
    // eslint-disable-next-line consistent-return
    if (!ok) return onChange?.(value, 'Unsupported file type');
    if (multiple) onChange?.([...(Array.isArray(value) ? value : []), file]);
    else onChange?.(file);
  };

  const handleInput = (e) => {
    const list = Array.from(e.target.files || []);
    if (multiple) {
      const next = Array.isArray(value) ? [...value] : [];
      // eslint-disable-next-line no-restricted-syntax
      for (const f of list) {
        if (f.size <= maxSizeMB * 1048576) next.push(f);
      }
      onChange?.(next);
    } else {
      validateAndAdd(list[0]);
    }
  };

  // eslint-disable-next-line consistent-return
  const removeAt = (i) => {
    if (!multiple) return onChange?.(null);
    const next = [...files];
    next.splice(i, 1);
    onChange?.(next);
  };

  return (
    <Box
      onDragOver={(e) => {
        e.preventDefault();
        setDragOver(true);
      }}
      onDragLeave={() => setDragOver(false)}
      onDrop={(e) => {
        e.preventDefault();
        setDragOver(false);
        const dropped = Array.from(e.dataTransfer.files || []);
        if (multiple) {
          const next = [...files];
          dropped.forEach((f) => {
            if (f.size <= maxSizeMB * 1048576) next.push(f);
          });
          onChange?.(next);
        } else {
          validateAndAdd(dropped[0]);
        }
      }}
      sx={(t) => ({
        p: 2,
        borderRadius: 2,
        border: `1px dashed ${alpha(t.palette.primary.main, 0.35)}`,
        bgcolor: dragOver ? alpha(t.palette.primary.light, 0.08) : 'background.paper',
        minHeight: 130,
        display: 'flex',
        flexDirection: 'column',
        gap: 1,
      })}
    >
      <Typography variant="subtitle2" fontWeight={800}>
        {label}
      </Typography>
      <Box
        sx={(t) => ({
          flex: 1,
          borderRadius: 1.5,
          border: `1px dashed ${t.palette.divider}`,
          bgcolor: t.palette.action.hover,
          display: 'grid',
          placeItems: 'center',
          textAlign: 'center',
          p: 2,
        })}
      >
        <Stack spacing={0.5} alignItems="center">
          <Icon icon="mdi:cloud-upload-outline" width={22} />
          <Typography variant="caption" color={error ? 'error.main' : 'text.secondary'}>
            {error || caption || 'Click to upload or drag and drop'}
          </Typography>
          <Button size="small" variant="outlined" onClick={() => inputRef.current?.click()}>
            Browse
          </Button>
          <input
            hidden
            ref={inputRef}
            type="file"
            accept={accept}
            multiple={multiple}
            onChange={handleInput}
          />
        </Stack>
      </Box>

      {/* file list */}
      {!!files.length && (
        <Stack direction="row" flexWrap="wrap" gap={0.75}>
          {files.map((f, i) => (
            <Chip
              key={`${f.name}-${i}`}
              label={`${f.name} • ${fmtSize(f.size)}`}
              onDelete={() => removeAt(i)}
              size="small"
              sx={{ maxWidth: '100%' }}
            />
          ))}
        </Stack>
      )}
    </Box>
  );
}
