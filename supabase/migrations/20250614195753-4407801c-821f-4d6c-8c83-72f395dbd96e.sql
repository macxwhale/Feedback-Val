
CREATE TYPE public.member_with_inviter AS (
    id UUID,
    user_id UUID,
    email TEXT,
    role TEXT,
    status TEXT,
    created_at TIMESTAMPTZ,
    accepted_at TIMESTAMPTZ,
    invited_by JSONB
);

CREATE OR REPLACE FUNCTION public.get_organization_members(p_org_id UUID)
RETURNS SETOF public.member_with_inviter
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    RETURN QUERY
    SELECT
        ou.id,
        ou.user_id,
        ou.email,
        ou.role,
        ou.status,
        ou.created_at,
        ou.accepted_at,
        CASE
            WHEN ou.invited_by_user_id IS NOT NULL THEN
                (SELECT jsonb_build_object('email', u.email) FROM auth.users u WHERE u.id = ou.invited_by_user_id)
            ELSE
                NULL
        END AS invited_by
    FROM
        organization_users ou
    WHERE
        ou.organization_id = p_org_id
    ORDER BY
        ou.created_at DESC;
END;
$$;
