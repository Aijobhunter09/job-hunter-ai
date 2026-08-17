const HIMALAYAS_API = 'https://himalayas.app/jobs/api';
const HIMALAYAS_SEARCH_API = 'https://himalayas.app/jobs/api/search';

export default {
  async fetch(request: Request): Promise<Response> {
    const url = new URL(request.url);

    if (url.pathname === '/api/jobs') {
      try {
        const apiUrl = new URL(HIMALAYAS_API);

        const limit = url.searchParams.get('limit') || '20';
        const offset = url.searchParams.get('offset') || '0';

        apiUrl.searchParams.set('limit', limit);
        apiUrl.searchParams.set('offset', offset);

        const response = await fetch(apiUrl.toString(), {
          headers: {
            Accept: 'application/json',
          },
        });

        if (!response.ok) {
          return Response.json(
            {
              error: 'Himalayas API request failed',
              status: response.status,
            },
            { status: 502 }
          );
        }

        const data = await response.json();

        return Response.json(data, {
          headers: {
            'Cache-Control': 'public, max-age=300',
          },
        });
      } catch (error) {
        console.error('Jobs API error:', error);

        return Response.json(
          {
            error: 'Unable to fetch jobs',
          },
          { status: 500 }
        );
      }
    }

    if (url.pathname === '/api/jobs/search') {
      try {
        const apiUrl = new URL(HIMALAYAS_SEARCH_API);

        const allowedParams = [
          'q',
          'country',
          'worldwide',
          'exclude_worldwide',
          'seniority',
          'employment_type',
          'company',
          'timezone',
          'sort',
          'page',
        ];

        for (const param of allowedParams) {
          const value = url.searchParams.get(param);

          if (value) {
            apiUrl.searchParams.set(param, value);
          }
        }

        const response = await fetch(apiUrl.toString(), {
          headers: {
            Accept: 'application/json',
          },
        });

        if (!response.ok) {
          return Response.json(
            {
              error: 'Himalayas search API request failed',
              status: response.status,
            },
            { status: 502 }
          );
        }

        const data = await response.json();

        return Response.json(data, {
          headers: {
            'Cache-Control': 'public, max-age=300',
          },
        });
      } catch (error) {
        console.error('Jobs search API error:', error);

        return Response.json(
          {
            error: 'Unable to search jobs',
          },
          { status: 500 }
        );
      }
    }

    return new Response('Not Found', {
      status: 404,
    });
  },
};
