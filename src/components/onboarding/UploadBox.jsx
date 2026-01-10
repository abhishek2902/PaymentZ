import { Icon } from '@iconify/react';
import React, { useRef, useMemo, useState } from 'react';

import { alpha } from '@mui/material/styles';
import { Box, Stack, Button, Tooltip, Typography, IconButton } from '@mui/material';

function fmtSize(b) {
  if (b > 1024 * 1024) return `${(b / 1048576).toFixed(1)} MB`;
  if (b > 1024) return `${(b / 1024).toFixed(0)} KB`;
  return `${b} B`;
}

export default function UploadBox({
  label,
  hint,
  value, // File | null
  onChange,
  accept = 'application/pdf,image/*',
  maxSizeMB = 10,
  error,
}) {
  const inputRef = useRef(null);
  const [dragOver, setDragOver] = useState(false);

  const preview = useMemo(() => {
    if (!value) return null;
    if (value.type?.startsWith('image/')) return URL.createObjectURL(value);
    return null;
  }, [value]);

  const pick = (f) => {
    if (!f) return;
    if (f.size > maxSizeMB * 1048576) {
      onChange?.(null, `Max ${maxSizeMB}MB allowed`);
      return;
    }
    const ok = accept.split(',').some((a) => {
      a = a.trim();
      if (a.endsWith('/*')) return f.type.startsWith(a.replace('/*', '/'));
      return a === f.type || (a === 'image/*' && f.type.startsWith('image/'));
    });
    if (!ok) {
      onChange?.(null, 'Unsupported file type');
      return;
    }
    onChange?.(f);
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
        pick(e.dataTransfer.files?.[0]);
      }}
      sx={(t) => ({
        p: 2,
        borderRadius: 2,
        border: `1px dashed ${alpha(t.palette.primary.main, 0.35)}`,
        bgcolor: dragOver ? alpha(t.palette.primary.light, 0.08) : 'background.paper',
      })}
    >
      <Stack direction="row" spacing={2} alignItems="center">
        <Box
          sx={(t) => ({
            width: 48,
            height: 48,
            borderRadius: 1.5,
            display: 'grid',
            placeItems: 'center',
            bgcolor: alpha(t.palette.primary.main, 0.12),
            color: 'primary.main',
            flexShrink: 0,
          })}
        >
          <Icon icon={value ? 'mdi:file-check' : 'mdi:cloud-upload-outline'} width={24} />
        </Box>

        <Stack spacing={0.25} sx={{ flex: 1 }}>
          <Typography variant="subtitle2" fontWeight={800}>
            {label}
          </Typography>
          <Typography variant="caption" color={error ? 'error.main' : 'text.secondary'}>
            {error || hint || 'PDF, PNG or JPG • drag & drop or browse'}
          </Typography>

          {value ? (
            <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 1 }}>
              {preview ? (
                <Box
                  component="img"
                  src={preview}
                  alt="preview"
                  sx={{ width: 40, height: 40, borderRadius: 1, objectFit: 'cover' }}
                />
              ) : (
                <Icon icon="mdi:file-pdf-box" width={28} />
              )}
              <Typography variant="body2" sx={{ flex: 1, minWidth: 0 }} noWrap title={value.name}>
                {value.name}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {fmtSize(value.size)}
              </Typography>
              <Tooltip title="Remove">
                <IconButton size="small" onClick={() => onChange?.(null)}>
                  <Icon icon="mdi:close" />
                </IconButton>
              </Tooltip>
            </Stack>
          ) : null}
        </Stack>

        <input
          ref={inputRef}
          type="file"
          accept={accept}
          hidden
          onChange={(e) => pick(e.target.files?.[0])}
        />
        <Button variant="outlined" onClick={() => inputRef.current?.click()}>
          Browse
        </Button>
      </Stack>
    </Box>
  );
}
