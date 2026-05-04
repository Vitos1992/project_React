1. Відображається список фільмів, до 10 фільміф на кожній сторінці
2. Кожний фільм має в собі поля:
    - назва фільму,
    - режесер,
    - рік випуску
3. По натиснуню на фільм відкриваємо окрему сторінку фільму де будуть відображенні більше данних
4. Зробити все без антифікації (режим гістя)

+
Д/З
+

5. Проглянути та ознайомитися на практиці в терміналі 20 команд
6. Дізнатися які типи кондних терміналів існує (zsh, powershell, bash), які основні командні інтерфейси 
7. install gimini cli
8. авторизація vs автентифікація, в чому різниця, для чого, коли, як використовується
9. розібратися чому 

    const movies = await Promise.all(
        pageItems.map(async (movie) => ({
            id: movie.id,
            title: movie.title || movie.original_title,
            releaseYear: movie.release_date ? movie.release_date.split('-')[0] : 'Н/Д',
            director: await fetchMovieDirector(movie.id),
            posterPath: movie.poster_path
        }))
    );

    чому це погано.