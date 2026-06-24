-- Grant public read access to learning content tables
GRANT SELECT ON public.quyen TO anon, authenticated;
GRANT SELECT ON public.chude TO anon, authenticated;
GRANT SELECT ON public.chang TO anon, authenticated;
GRANT SELECT ON public.noidung TO anon, authenticated;
GRANT SELECT ON public.bai TO anon, authenticated;
GRANT SELECT ON public.hinh TO anon, authenticated;
GRANT ALL ON public.quyen, public.chude, public.chang, public.noidung, public.bai, public.hinh TO service_role;

ALTER TABLE public.quyen ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chude ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chang ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.noidung ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bai ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hinh ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read quyen" ON public.quyen FOR SELECT USING (true);
CREATE POLICY "Public read chude" ON public.chude FOR SELECT USING (true);
CREATE POLICY "Public read chang" ON public.chang FOR SELECT USING (true);
CREATE POLICY "Public read noidung" ON public.noidung FOR SELECT USING (true);
CREATE POLICY "Public read bai" ON public.bai FOR SELECT USING (true);
CREATE POLICY "Public read hinh" ON public.hinh FOR SELECT USING (true);