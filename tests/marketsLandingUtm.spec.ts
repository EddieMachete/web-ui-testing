
/*
 * Associated issues, in order of implementation
 * #3985 - Forward UTM params to Markets admin links on marketing web assets
 * 
 * UTM parameters:
 *   utm_campaign
 *   utm_content
 *   utm_medium
 *   utm_source
 *   utm_term
 */

import { test, expect, Locator } from '@playwright/test';
import { TEST_CONFIGURATION } from './globalVariables';

test.describe(
  'Forward UTM params to Markets admin links on marketing web assets', () => {
    test(
      'Forwards all expected UTM params when all of them are present',
      async ({ browser }) => {
        /*
          Given that a merchant is at the Markets landing page
          When URL contains the parameters ?utm_campaign=MarketsGA&utm_content=content-example&utm_source=Facebook&utm_medium=social&utm_term=term-example
          Then the links to the Markets admin page, hero button Login to get started, signup section link Log in to get started, and mobile fixed button Log in to get started, propagate the UTM parameters ?utm_campaign=MarketsGA&utm_content=content-example&utm_source=Facebook&utm_medium=social&utm_term=term-example
          Can forward expected UTM params from Markets landing page to Markets admin when only a few are present
        */

        // Setup HTTP credemtials for when the tests run on staging
        const context = await browser.newContext(
          {
            httpCredentials: {
              username: TEST_CONFIGURATION.httpAuthUserName,
              password: TEST_CONFIGURATION.httpAuthPassword,
            }
          }
        );

        const page = await context.newPage();
        
        await page.goto(`${TEST_CONFIGURATION.baseUrl}markets?utm_campaign=MarketsGA&utm_content=content-example&utm_source=Facebook&utm_medium=social&utm_term=term-example`);

        const ctas: Locator = page.locator('.js-markets-cta-params');

        let ctaCount: number = await ctas.count();
        expect(ctaCount).toBe(3);
        await expect(ctas).toHaveCount(3);
        
        for (let i: number = 0; i<ctaCount; i++) {
          const cta: Locator = ctas.nth(i);
          const href: string = await cta.getAttribute('href');
          const params: URLSearchParams = new URL(href).searchParams;

          expect(Array.from(params.keys()).length).toBe(5);
          expect(params.has('utm_campaign')).toBeTruthy;
          expect(params.get('utm_campaign')).toBe('MarketsGA');
          expect(params.has('utm_content')).toBeTruthy;
          expect(params.get('utm_content')).toBe('content-example');
          expect(params.has('utm_source')).toBeTruthy;
          expect(params.get('utm_source')).toBe('Facebook');
          expect(params.has('utm_medium')).toBeTruthy;
          expect(params.get('utm_medium')).toBe('social');
          expect(params.has('utm_term')).toBeTruthy;
          expect(params.get('utm_term')).toBe('term-example');
        }
      }
    );

    test(
      'Forwards subset of expected UTM parameters found in url',
      async ({ browser }) => {
        /*
          Given that a merchant is at Markets landing page
          When URL contains the parameters ?utm_source=Facebook&utm_campaign=MarketsGA&utm_abc=def&param1=one
          Then the links to the Markets admin page, hero button Login to get started, signup section link Log in to get started, and mobile fixed button Log in to get started, propagate the UTM parameters ?utm_source=Facebook&utm_campaign=MarketsGA
          No parameters are added to buttons and links when no UTM parameters are available
        */

        // Setup HTTP credemtials for when the tests run on staging
        const context = await browser.newContext(
          {
            httpCredentials: {
              username: TEST_CONFIGURATION.httpAuthUserName,
              password: TEST_CONFIGURATION.httpAuthPassword,
            }
          }
        );

        const page = await context.newPage();
        
        await page.goto(`${TEST_CONFIGURATION.baseUrl}markets?utm_source=Facebook&utm_campaign=MarketsGA&utm_abc=def&param1=one`);

        const ctas: Locator = page.locator('.js-markets-cta-params');

        let ctaCount: number = await ctas.count();
        expect(ctaCount).toBe(3);
        await expect(ctas).toHaveCount(3);
        
        for (let i: number = 0; i<ctaCount; i++) {
          const cta: Locator = ctas.nth(i);
          const href: string = await cta.getAttribute('href');
          const params: URLSearchParams = new URL(href).searchParams;

          expect(Array.from(params.keys()).length).toBe(2);
          expect(params.has('utm_campaign')).toBeTruthy;
          expect(params.get('utm_campaign')).toBe('MarketsGA');
          expect(params.has('utm_source')).toBeTruthy;
          expect(params.get('utm_source')).toBe('Facebook');
        }
      }
    );

    test(
      'Ignores UTM parameters when not in lowercase',
      async ({ browser }) => {
        /*
          Given that a merchant is at Markets landing page
          When URL contains the parameters ?utm_source=Facebook&utm_campaign=MarketsGA&utm_abc=def&param1=one
          Then the links to the Markets admin page, hero button Login to get started, signup section link Log in to get started, and mobile fixed button Log in to get started, propagate the UTM parameters ?utm_source=Facebook&utm_campaign=MarketsGA
          No parameters are added to buttons and links when no UTM parameters are available
        */

        // Setup HTTP credemtials for when the tests run on staging
        const context = await browser.newContext(
          {
            httpCredentials: {
              username: TEST_CONFIGURATION.httpAuthUserName,
              password: TEST_CONFIGURATION.httpAuthPassword,
            }
          }
        );

        const page = await context.newPage();
        
        await page.goto(`${TEST_CONFIGURATION.baseUrl}markets?utm_Campaign=MarketsGA&utm_conTent=content-example&UTM_SOURCE=Facebook&utm_mediuM=social&UTM_term=term-example`);

        const ctas: Locator = page.locator('.js-markets-cta-params');

        let ctaCount: number = await ctas.count();
        expect(ctaCount).toBe(3);
        await expect(ctas).toHaveCount(3);
        
        for (let i: number = 0; i<ctaCount; i++) {
          const cta: Locator = ctas.nth(i);
          const href: string = await cta.getAttribute('href');
          const params: URLSearchParams = new URL(href).searchParams;

          expect(Array.from(params.keys()).length).toBe(0);
        }
      }
    );

    test(
      'No parameters are added to buttons and links when no UTM parameters are available',
      async ({ browser }) => {
        /*
          Given that a merchant is at Markets landing page
          When URL does not contain any parameters
          Then the links to the Markets admin page, hero button Login to get started, signup section link Log in to get started, and mobile fixed button Log in to get started, will not contain any UTM parameters
        */

        // Setup HTTP credemtials for when the tests run on staging
        const context = await browser.newContext(
          {
            httpCredentials: {
              username: TEST_CONFIGURATION.httpAuthUserName,
              password: TEST_CONFIGURATION.httpAuthPassword,
            }
          }
        );

        const page = await context.newPage();
        
        await page.goto(`${TEST_CONFIGURATION.baseUrl}markets`);

        const ctas: Locator = page.locator('.js-markets-cta-params');

        let ctaCount: number = await ctas.count();
        expect(ctaCount).toBe(3);
        await expect(ctas).toHaveCount(3);
        
        for (let i: number = 0; i<ctaCount; i++) {
          const cta: Locator = ctas.nth(i);
          const href: string = await cta.getAttribute('href');
          const params: URLSearchParams = new URL(href).searchParams;

          expect(Array.from(params.keys()).length).toBe(0);
        }
      }
    );
  }
);
