import { supabase } from '@/integrations/supabase/client';

type FirecrawlResponse<T = any> = {
  success: boolean;
  error?: string;
  data?: T;
};

export const firecrawlApi = {
  async search(query: string): Promise<FirecrawlResponse> {
    const { data, error } = await supabase.functions.invoke('scrape-grants', {
      body: { query },
    });

    if (error) {
      return { success: false, error: error.message };
    }
    return { success: true, data };
  },
};
