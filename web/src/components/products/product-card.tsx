export default function ProductCard({title}: {title: string}) {
    return  <div className="flex p-10">
            <div className="he-product-card">
              <img src="images/first_aid_basics.png" alt="First Aid" />
              <div className="he-product-name mt-2">{title}</div>
            </div>
          </div>
}