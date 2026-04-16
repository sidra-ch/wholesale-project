$ErrorActionPreference = "Stop"
$token = "1|hoPqHTHuS7KXeJd90Ln9CKu3MT2xUumnxRpBhokU8345da9d"
$baseUrl = "https://arslanwholesale.alwaysdata.net/api"
$h = @{
    Authorization = "Bearer $token"
    "Content-Type" = "application/json"
    Accept = "application/json"
}

Write-Host "=== Updating Category Images ==="
$catMap = @(
    @{id=1; img="/images/img25.jpeg"},
    @{id=2; img="/images/img26.jpeg"},
    @{id=3; img="/images/img27.jpeg"},
    @{id=4; img="/images/img28.jpeg"},
    @{id=5; img="/images/img29.jpeg"},
    @{id=6; img="/images/img30.jpeg"}
)
foreach ($c in $catMap) {
    $body = @{ image = $c.img } | ConvertTo-Json
    try {
        $null = Invoke-RestMethod -Uri "$baseUrl/admin/categories/$($c.id)" -Method PUT -Headers $h -Body $body
        Write-Host "  Category $($c.id): OK"
    } catch {
        Write-Host "  Category $($c.id): FAIL - $($_.Exception.Message)"
    }
}

Write-Host ""
Write-Host "=== Updating Product Images ==="
# Product image mapping: product_id -> array of image URLs
$prodImages = @(
    @{id=1; images=@("/images/img1.jpeg", "/images/img2.jpeg")},
    @{id=2; images=@("/images/img3.jpeg", "/images/img4.jpeg")},
    @{id=3; images=@("/images/img5.jpeg", "/images/img6.jpeg")},
    @{id=4; images=@("/images/img7.jpeg", "/images/img8.jpeg")},
    @{id=5; images=@("/images/img9.jpeg", "/images/img10.jpeg")},
    @{id=6; images=@("/images/img11.jpeg", "/images/img12.jpeg")},
    @{id=7; images=@("/images/img13.jpeg", "/images/img14.jpeg")},
    @{id=8; images=@("/images/img15.jpeg", "/images/img16.jpeg")}
)

foreach ($p in $prodImages) {
    $body = @{ images = $p.images } | ConvertTo-Json
    try {
        $null = Invoke-RestMethod -Uri "$baseUrl/admin/products/$($p.id)" -Method PUT -Headers $h -Body $body
        Write-Host "  Product $($p.id): OK"
    } catch {
        Write-Host "  Product $($p.id): FAIL - $($_.Exception.Message)"
    }
}

Write-Host ""
Write-Host "=== Verifying ==="
$cats = Invoke-RestMethod -Uri "$baseUrl/categories"
foreach ($c in $cats.categories) {
    Write-Host "  Cat $($c.id) '$($c.name)': $($c.image)"
}

$prods = Invoke-RestMethod -Uri "$baseUrl/products"
foreach ($p in $prods.data) {
    $imgs = ($p.images | ForEach-Object { $_.image_url }) -join ", "
    Write-Host "  Prod $($p.id) '$($p.name)': $imgs"
}

Write-Host ""
Write-Host "Done!"
