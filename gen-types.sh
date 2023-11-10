dir=$(dirname $(realpath $0));
echo $dir
(cd $dir/supabase; npx supabase gen types typescript --local > ./../types/database.types.ts;)
#(cd $dir/supabase; npx supabase gen types typescript --linked > ./../types/database.types.ts)

# pg vector doesn't work with supabase type generation
find $dir/types/database.types.ts -type f -exec sed -i 's/embedding: string/embedding: number[]/g' {} \;
find $dir/types/database.types.ts -type f -exec sed -i 's/embedding?: string/embedding?: number[]/g' {} \;
