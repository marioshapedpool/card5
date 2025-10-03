import { useEffect, useState } from 'react';
import supabase from '../utils/supabase';
import type { User } from '@supabase/supabase-js';

type Subscription = {
  id: string;
  status: 'free' | 'premium';
  valid_until: string | null;
};

export default function useUser() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [subscription, setSubscription] = useState<Subscription | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setUser(data.session?.user ?? null);
      setLoading(false);
    });

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    const fetchSubscription = async () => {
      if (!user) {
        setSubscription(null);
        return;
      }
      const { data, error } = await supabase
        .from('subscriptions')
        .select('id, status, valid_until')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) {
        console.error('Error fetching subscription', error.message);
        setSubscription(null);
      } else {
        setSubscription(data);
      }
    };
    fetchSubscription();
  }, [user]);

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  const isPremium = subscription?.status === 'premium';

  return { user, loading, signOut, isPremium };
}
