/**********************************************************************
 * Copyright (C) 2023 Red Hat, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * SPDX-License-Identifier: Apache-2.0
 ***********************************************************************/

/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-empty-function */

import '@testing-library/jest-dom/vitest';
import { test, expect, vi, beforeAll, describe } from 'vitest';
import { render, screen } from '@testing-library/svelte';
import PreferencesRegistriesEditing from './PreferencesRegistriesEditing.svelte';
import { registriesInfos } from '../../stores/registries';
import type { Registry } from '@podman-desktop/api';

beforeAll(() => {
  (window as any).window.ddExtensionInstall = vi.fn().mockResolvedValue(undefined);
  (window as any).window.getImageRegistryProviderNames = vi.fn().mockResolvedValue(undefined);
});

describe('PreferencesRegistriesEditing', () => {
  test('Expect that add registry button is visible and enabled', async () => {
    render(PreferencesRegistriesEditing, {});

    const button = screen.getByRole('button', { name: 'Add registry' });
    expect(button).toBeInTheDocument();
    expect(button).toBeEnabled();
  });

  test('Expect that existing registries are visible', async () => {
    const name = 'custom-container-registry';
    const registry: Registry = {
      source: 'test',
      serverUrl: 'https://test.com',
      name: name,
      username: 'user',
      secret: 'secret',
    };
    registriesInfos.set([registry]);
    render(PreferencesRegistriesEditing, {});

    const entry2 = screen.getByText(name);
    expect(entry2).toBeInTheDocument();

    // can still add more registries
    const button = screen.getByRole('button', { name: 'Add registry' });
    expect(button).toBeInTheDocument();
    expect(button).toBeEnabled();
  });

  test('Expect that adding a registry enables a form, and Login button is initially disabled', async () => {
    render(PreferencesRegistriesEditing, { showNewRegistryForm: true });

    const button = screen.getByRole('button', { name: 'Add registry' });
    expect(button).toBeInTheDocument();
    expect(button).toBeDisabled();

    const entry = screen.getByPlaceholderText('URL (HTTPS only)');
    expect(entry).toBeInTheDocument();

    const loginButton = screen.getByRole('button', { name: 'Login' });
    expect(loginButton).toBeInTheDocument();
    expect(loginButton).toBeDisabled();
  });
});
